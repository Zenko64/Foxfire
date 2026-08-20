import { createMiddleware } from "hono/factory";
import type { AppEnv } from "../../core/http/factory";
import { auth } from "../../lib/auth";
import { UnauthorizedError } from "../../lib/errors";

/**
 * Enforce Authentication
 * Attach auth context first.
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
 * Attach auth context.
 * It doesn't enforce auth.
 */
export const attachAuth = createMiddleware(async (c, next) => {
	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	c.set("user", session?.user ?? null);
	c.set("session", session?.session ?? null);

	return next();
});
