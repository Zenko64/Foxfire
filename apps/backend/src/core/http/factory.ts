/**
 * @file http/factory.ts
 * @name factory
 * @description This file exports a factory instance that can create other resources typed after AppEnv, that is also exported.
 * @exports AppEnv
 * @exports factory
 */
import { createFactory } from "hono/factory";
import type { auth } from "../../lib/auth";

export type AppEnv = {
	Variables: {
		session?: typeof auth.$Infer.Session.session;
		user?: typeof auth.$Infer.Session.user;
	};
};

export const factory = createFactory<AppEnv>();
