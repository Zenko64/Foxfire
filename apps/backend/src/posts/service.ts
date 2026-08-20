import { and, eq, ilike, or } from "drizzle-orm";
import db from "../db";
import { postsTable } from "../db/schema";
import {
	BadRequestError,
	ForbiddenError,
	InternalError,
	NotFoundError,
} from "../lib/errors";

const postRelCols = {
	author: {
		columns: {
			id: true,
			username: true,
			displayUsername: true,
			image: true,
		},
	},
} as const;

/**
 * @name getPosts
 * @description Queries The Posts Table.
 * @param { query, authorId } - Filters.
 * @param userId - Logged In UserID, to return private user data.
 * @returns
 */
export async function getPosts(
	{ query, authorId }: { query?: string; authorId?: string },
	userId?: string,
) {
	return db.query.postsTable.findMany({
		where: (r) => {
			const conditions = [
				or(
					eq(r.privacy, "public"),
					userId ? eq(r.authorId, userId) : undefined,
				),
			];

			if (query) conditions.push(ilike(r.text, `%${query}%`));
			if (authorId) conditions.push(eq(r.authorId, authorId));

			return and(...conditions);
		},
		columns: {
			createdAt: true,
			nanoid: true,
			pinned: true,
			privacy: true,
			text: true,
		},
		with: postRelCols,
	});
}

/**
 * @name getPost
 * @description Queries a Post in the Posts Table.
 * @param { id, nanoid } - Post Identifier
 * @param userId - Logged In UserID, to return private user data.
 * @returns
 */
export async function getPost(
	postId: Partial<Pick<typeof postsTable.$inferSelect, "id" | "nanoid">>,
	userId?: string,
) {
	const data = await db.query.postsTable.findFirst({
		where: (r) => {
			const conditions = [
				or(
					eq(r.privacy, "public"),
					eq(r.privacy, "unlisted"),
					userId ? eq(r.authorId, userId) : undefined,
				),
			];

			if (postId.id) conditions.push(eq(r.id, postId.id));
			if (postId.nanoid) conditions.push(eq(r.nanoid, postId.nanoid));
			if (conditions.length < 1)
				throw new BadRequestError(
					"The post to retrieve was not specified in the request payload.",
				);

			return and(...conditions);
		},
		columns: {
			createdAt: true,
			nanoid: true,
			pinned: true,
			privacy: true,
			text: true,
		},
		with: postRelCols,
	});
	if (!data) throw new NotFoundError("The requested post was not found.");
	return data;
}

export async function createPost(
	postData: Omit<
		typeof postsTable.$inferInsert,
		"id" | "createdAt" | "updatedAt"
	>,
) {
	return await db.transaction(async (tx) => {
		const [newPost] = await tx
			.insert(postsTable)
			.values(postData)
			.returning({ id: postsTable.id });

		if (!newPost)
			throw new InternalError(
				"An unknown error has occurred while creating a post.",
			);

		const result = await tx.query.postsTable.findFirst({
			where: (p) => eq(p.id, newPost.id),
			columns: {
				nanoid: true,
				text: true,
				pinned: true,
				privacy: true,
				createdAt: true,
			},
			with: postRelCols,
		});

		if (!result)
			throw new InternalError(
				"An unknown error has occured while retrieving the created post.",
			);
		return result;
	});
}

export async function updatePost(
	postData: Partial<
		Pick<typeof postsTable.$inferInsert, "text" | "privacy" | "pinned">
	>,
	postId: Partial<Pick<typeof postsTable.$inferSelect, "id" | "nanoid">>,
	userId: string,
) {
	return await db.transaction(async (tx) => {
		const conditions = [];
		if (postId.id) conditions.push(eq(postsTable.id, postId.id));
		if (postId.nanoid) conditions.push(eq(postsTable.nanoid, postId.nanoid));
		if (conditions.length < 1)
			throw new BadRequestError(
				"The post to update was not specified in the request payload.",
			);

		const [result] = await tx
			.update(postsTable)
			.set(postData)
			.where(and(...conditions, eq(postsTable.authorId, userId)))
			.returning({ id: postsTable.id });

		if (!result) {
			// This branch finds the cause of the error
			const verif = await tx.query.postsTable.findFirst({
				where: and(...conditions),
				columns: {
					privacy: true,
					authorId: true,
				},
			});

			if (!verif || (verif.authorId !== userId && verif.privacy === "private"))
				throw new NotFoundError("The specified post was not found.");
			if (verif.authorId !== userId)
				throw new ForbiddenError(
					"You don't have permission to edit this post.",
				);
			throw new InternalError(
				"An unknown error has occurred while updating the post.",
			);
		}

		const updated = await tx.query.postsTable.findFirst({
			where: (p) => eq(p.id, result.id),
			columns: {
				nanoid: true,
				text: true,
				pinned: true,
				privacy: true,
				createdAt: true,
			},
			with: postRelCols,
		});

		if (!updated)
			throw new InternalError(
				"An unknown error has occurred while retrieving the updated post.",
			);

		return updated;
	});
}

export async function deletePost(
	postId: Partial<Pick<typeof postsTable.$inferSelect, "id" | "nanoid">>,
	userId: string,
) {
	const conditions = [];
	if (postId.id) conditions.push(eq(postsTable.id, postId.id));
	if (postId.nanoid) conditions.push(eq(postsTable.nanoid, postId.nanoid));
	if (conditions.length < 1)
		throw new BadRequestError(
			"The post to delete was not specified in the request payload.",
		);

	const result = await db
		.delete(postsTable)
		.where(and(...conditions, eq(postsTable.authorId, userId)));

	if (result.rowCount === 0) {
		const verif = await db.query.postsTable.findFirst({
			where: and(...conditions),
			columns: {
				privacy: true,
				authorId: true,
			},
		});

		if (!verif || (verif.authorId !== userId && verif.privacy === "private"))
			throw new NotFoundError("The specified post was not found.");
		else if (verif.authorId !== userId)
			throw new ForbiddenError(
				"You don't have permission to delete this post.",
			);
		else {
			throw new InternalError(
				"An unknown error has occurred while deleting the post.",
			);
		}
	}

	return result;
}
