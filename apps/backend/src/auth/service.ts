/**
 * @file auth/service.ts
 * @name Auth Service
 * @description This file contains queries and interactions with the auth data at a service layer. Used for providing queries not provided by BetterAuth.
 */
import { and, eq } from "drizzle-orm";
import db from "../db";
import type { user } from "../db/auth-schema";
import { BadRequestError, NotFoundError } from "../lib/errors";

/**
 * @name getUser
 * @description Query for a single user.
 * @param userId {id | username} - The user data to filter for the right user.
 * @returns {image, username, displayUsername}
 */
export async function getUser(
	userId: Partial<Pick<typeof user.$inferSelect, "id" | "username">>,
) {
	const result = await db.query.user.findFirst({
		where: (u) => {
			const conditions = [];
			if (userId.id) conditions.push(eq(u.id, userId.id));
			if (userId.username) conditions.push(eq(u.username, userId.username));
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
