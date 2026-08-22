/**
 * @file auth/http/middlewares.ts
 * @name middlewares
 * @module auth/http/middlewares
 * @description This file provides middlewares to allow routes to interact with session and user auth data.
 */
import { createMiddleware } from "hono/factory";
import type { AppEnv } from "../../core/http/factory";
import { auth } from "../../lib/auth";
import { ForbiddenError, UnauthorizedError } from "../../lib/errors";

/**
 * @name requireAuth
 * @description requireAuth throws an UnauthorizedError if the consuming endpoint receives an unauthenticated request.
 * @requires attachAuth
 */
export const requireAuth = createMiddleware<
	AppEnv & {
		Variables: {
			session: typeof auth.$Infer.Session.session;
			user: typeof auth.$Infer.Session.user;
		};
	}
>(async (c, next) => {
	if (!c.var.user) throw new UnauthorizedError();
	return next();
});

/**
 * @name attachAuth
 * @description attachAuth attaches user and session context data from the request that can be read by middlewares and handlers if they exist.
 */
export const attachAuth = createMiddleware<
	AppEnv & {
		Variables: {
			session: typeof auth.$Infer.Session.session | null;
			user: typeof auth.$Infer.Session.user | null;
		};
	}
>(async (c, next) => {
	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	if (session) {
		c.set("user", session.user);
		c.set("session", session.session);
	}

	return next();
});

/**
 * @name requireSetup
 * @description requireSetup forces the caller (logged in) to have finished the account setup before proceeding.
 */
export const requireSetup = createMiddleware<
	AppEnv & {
		Variables: {
			session: typeof auth.$Infer.Session.session | null;
			user: typeof auth.$Infer.Session.user | null;
		};
	}
>(async (c, next) => {
	if (c.var.user && (!c.var.user.username || !c.var.user.displayUsername)) {
		throw new ForbiddenError(
			"You are required to complete the setup before accessing this resource.",
		);
	}

	return next();
});
