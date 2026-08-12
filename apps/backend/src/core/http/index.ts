import { attachAuth } from "../../auth/http/middlewares";
import authRouter from "../../auth/http/routes";
import postsRouter from "../../posts/http/routes";
import { env } from "../env";
import { factory } from "./factory";

const app = factory
	.createApp()
	.use("*", attachAuth)
	.route("/api/auth", authRouter)
	.route("/api/posts", postsRouter);

export function serveHttp() {
	return Bun.serve({ fetch: app.fetch, port: env.PORT, hostname: env.HOST });
}

export type AppType = typeof app;
