/**
 * @file core/http/index.ts
 * @name http/core
 * @module core/http
 * @description Http Server Core. Exports The AppType used for Hono/Client route type inference.
 */
import { attachAuth } from "../../auth/http/middlewares";
import authRouter from "../../auth/http/routes";
import postsRouter from "../../posts/http/routes";
import { env } from "../env";
import { factory } from "./factory";
import { errorHandler } from "./handlers";

const app = factory
	.createApp()
	.use("*", attachAuth)
	.route("/api/auth", authRouter)
	.route("/api/posts", postsRouter)
	.onError(errorHandler);

export function serveHttp() {
	return Bun.serve({ fetch: app.fetch, port: env.PORT, hostname: env.HOST });
}

export type AppType = typeof app;
