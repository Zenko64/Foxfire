import { authSchema } from "@foxfire/types";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { anonymous, username } from "better-auth/plugins";
import * as schema from "../../src/db/auth-schema";
import { env } from "../core/env";
import db from "../db";

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: "pg", schema }),
	baseURL: env.APP_URL,
	emailAndPassword: { enabled: true },
	plugins: [
		username({
			minUsernameLength: 3,
			maxUsernameLength: 30,
			usernameValidator: (val) =>
				authSchema.shape.username.safeParse(val).success,
			displayUsernameValidator: (val) =>
				authSchema.shape.displayUsername.safeParse(val).success,
		}),
		anonymous(),
	],
	user: {
		deleteUser: {
			enabled: true,
		},
	},
});
