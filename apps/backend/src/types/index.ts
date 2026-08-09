import type { Context } from "hono";
import type { auth } from "../lib/auth";

export type AppEnv = {
	Bindings: undefined;
	Variables: {
		session: typeof auth.$Infer.Session.session | null;
		user: typeof auth.$Infer.Session.user | null;
	};
};

export type AppContext = Context<AppEnv>;
