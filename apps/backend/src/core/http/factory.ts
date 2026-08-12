import type { Env } from "hono";
import { createFactory } from "hono/factory";
import type { auth } from "../../lib/auth";

export type AppEnv = Env & {
	Variables: {
		session?: typeof auth.$Infer.Session.session | null;
		user?: typeof auth.$Infer.Session.user | null;
	};
};

export const factory = createFactory<AppEnv>();
