/**
 * @file core/http/index.ts
 * @name http/core
 * @module core/http
 * @description Http Server Core. Exports The AppType used for Hono/Client route type inference.
 */
import type { ApiErrorData } from "@foxfire/types";
import type { ApplyGlobalResponse } from "hono/client";
import { attachAuth, requireSetup } from "../../auth/http/middlewares";
import authRouter from "../../auth/http/routes";
import postsRouter from "../../posts/http/routes";
import { env } from "../env";
import { factory } from "./factory";
import { errorHandler } from "./handlers";

const app = factory
	.createApp()
	.use("*", attachAuth)
	.route("/api/auth", authRouter)
	.use(requireSetup)
	.route("/api/posts", postsRouter)
	.onError(errorHandler)
	.notFound((c) =>
		c.json<ApiErrorData>(
			{ code: "NOT_FOUND", message: "The requested resource was not found" },
			404,
		),
	);

export function serveHttp() {
	return Bun.serve({ fetch: app.fetch, port: env.PORT, hostname: env.HOST });
}

export type AppType = ApplyGlobalResponse<
	typeof app,
	{
		400: { json: ApiErrorData };
		401: { json: ApiErrorData };
		403: { json: ApiErrorData };
		404: { json: ApiErrorData };
		500: { json: ApiErrorData };
	}
>;
