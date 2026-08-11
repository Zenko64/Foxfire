import type { Env } from "hono";
import { createMiddleware } from "hono/factory";
import { auth } from "../../lib/auth";
import { UnauthorizedError } from "../../lib/errors";

export const requireAuth = createMiddleware<
	Env & {
		Variables: {
			session: typeof auth.$Infer.Session.session;
			user: typeof auth.$Infer.Session.user;
		};
	}
>(async (c, next) => {
	if (!c.var.user) throw new UnauthorizedError();
	return next();
});

export const attachAuth = createMiddleware(async (c, next) => {
	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	c.set("user", session?.user ?? null);
	c.set("session", session?.session ?? null);

	return next();
});
