import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { nanoid as mkNanoid } from "nanoid";
import { requireAuth } from "../../auth/http/middlewares";
import { factory } from "../../core/http/factory";
import db from "../../db";
import * as handlers from "../service";
import { postSchema } from "../types";

const postsRouter = factory
	.createApp()
	.get("/", async (c) => {
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
				c.var.user?.id ?? undefined,
			),
		);
	})
	.get("/:nanoid", async (c) => {
		const nanoid = c.req.param("nanoid");

		return c.json(
			await handlers.getPost({ nanoid }, c.var.user?.id ?? undefined),
		);
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
			return c.json(
				await handlers.updatePost({ ...data }, { nanoid }, c.var.user.id),
			);
		},
	)
	.delete("/:nanoid", requireAuth, async (c) => {
		const nanoid = c.req.param("nanoid");
		return c.json(await handlers.deletePost({ nanoid }, c.var.user.id));
	});

export default postsRouter;
