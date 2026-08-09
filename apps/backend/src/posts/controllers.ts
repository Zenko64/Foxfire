import { eq } from "drizzle-orm";
import db from "../db";
import type { AppContext } from "../types";
import * as handlers from "./handlers";

export async function getPosts(c: AppContext) {
	const { query, author } = c.req.query();
	const authorId = author
		? (
				await db.query.user.findFirst({
					where: (u) => eq(u.username, author),
					columns: { id: true },
				})
			)?.id
		: undefined;

	try {
		const result = await handlers.getPosts(
			{
				query,
				authorId,
			},
			c.var.user?.id ?? undefined,
		);
		return c.json(result);
	} catch (e) {
		console.error("Query Failed: ", e);
	}
}

export async function getPost(c: AppContext) {
	const nanoid = c.req.param("nanoid");

	try {
		const result = await handlers.getPost(
			{ nanoid },
			c.var.user?.id ?? undefined,
		);
		return c.json(result);
	} catch (e) {
		console.error("Query Failed: ", e);
	}
}

export async function createPost(c: AppContext) {}
export async function patchPost(c: AppContext) {}
export async function deletePost(c: AppContext) {}
