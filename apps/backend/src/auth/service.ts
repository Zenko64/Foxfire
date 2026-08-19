import { and, eq } from "drizzle-orm";
import db from "../db";
import type { user } from "../db/auth-schema";
import { BadRequestError, NotFoundError } from "../lib/errors";

export async function getUser(
	postId: Partial<Pick<typeof user.$inferSelect, "id" | "username">>,
) {
	const result = await db.query.user.findFirst({
		where: (u) => {
			const conditions = [];
			if (postId.id) conditions.push(eq(u.id, postId.id));
			if (postId.username) conditions.push(eq(u.username, postId.username));
			if (conditions.length < 1) {
				throw new BadRequestError(
					"The user to retrieve was not specified in the request payload.",
				);
			}
			return and(...conditions);
		},
		columns: {
			displayUsername: true,
			username: true,
			image: true,
		},
	});
	if (!result) throw new NotFoundError("The requested user was not found.");
	return result;
}
