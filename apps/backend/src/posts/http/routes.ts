/**
 * @name Posts HTTP Routes
 * @module posts/http
 * @file posts/http/routes.ts
 * @description Provides access to the posts service thru HTTP.
 */
import { postSchema } from "@foxfire/types";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { nanoid as mkNanoid } from "nanoid";
import z from "zod";
import { requireAuth } from "../../auth/http/middlewares";
import { factory } from "../../core/http/factory";
import db from "../../db";
import * as handlers from "../service";

const postsRouter = factory
	.createApp()
	.get(
		"/",
		zValidator(
			"query",
			z.object({ query: z.string().optional(), author: z.string().optional() }),
		),
		async (c) => {
			const { query, author } = c.req.query();
			const authorId = author
				? (
						await db.query.user.findFirst({
							where: (u) => eq(u.username, author),
							columns: { id: true },
						})
					)?.id
				: undefined;

			return c.json(
				await handlers.getPosts(
					{
						query,
						authorId,
					},
					c.var.user?.id,
				),
			);
		},
	)
	.get("/:nanoid", async (c) => {
		const nanoid = c.req.param("nanoid");

		return c.json(await handlers.getPost({ nanoid }, c.var.user?.id));
	})
	.post("/", requireAuth, zValidator("json", postSchema), async (c) => {
		const data = c.req.valid("json");
		return c.json(
			await handlers.createPost({
				...data,
				nanoid: mkNanoid(),
				authorId: c.var.user.id,
			}),
		);
	})
	.patch(
		"/:nanoid",
		requireAuth,
		zValidator("json", postSchema.partial()),
		async (c) => {
			const data = c.req.valid("json");
			const nanoid = c.req.param("nanoid");
			return c.json(await handlers.updatePost(data, { nanoid }, c.var.user.id));
		},
	)
	.delete("/:nanoid", requireAuth, async (c) => {
		const nanoid = c.req.param("nanoid");
		return c.json(await handlers.deletePost({ nanoid }, c.var.user.id));
	});

export default postsRouter;
