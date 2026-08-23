/**
 * @file auth/http/routes.ts
 * @name routes
 * @module auth/http/routes
 * @description This file provides a router instance that handles requests related to authentication and user data.
 */
import { factory } from "../../core/http/factory";
import { auth } from "../../lib/auth";
import { BadRequestError } from "../../lib/errors";
import { getUser, getUsers } from "../service";

const authRouter = factory
	.createApp({
		strict: false,
	})
	.get("/user/:username", async (c) => {
		const username = c.req.param("username");

		return c.json(await getUser({ username }));
	})
	.get("/users", async (c) => {
		const searchQuery = c.req.query("search");
		if (!searchQuery)
			throw new BadRequestError(
				"The search query parameter is missing in the request path.",
			);
		return c.json(await getUsers(searchQuery, 5));
	})

	.on(["POST", "GET"], "/*", (c) => auth.handler(c.req.raw));

export default authRouter;
