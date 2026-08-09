import { Hono } from "hono";
import authRouter from "./auth/routes";
import { env } from "./core/env";
import { auth } from "./lib/auth";
import postsRouter from "./posts/routes";
import type { AppEnv } from "./types";

const app = new Hono<AppEnv>()
	.use("*", async (c, next) => {
		const session = await auth.api.getSession({
			headers: c.req.raw.headers,
		});

		c.set("user", session?.user ?? null);
		c.set("session", session?.session ?? null);

		return next();
	})
	.route("/api/auth", authRouter)
	.route("/api/posts", postsRouter);

export type AppType = typeof app;
export default { fetch: app.fetch, port: env.PORT, hostname: env.HOST };
