import { authSchema } from "@foxfire/types";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username } from "better-auth/plugins";
import * as schema from "../../src/db/auth-schema";
import db from "../db";

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: "pg", schema }),
	baseURL: process.env.APP_URL!,
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
	],
	socialProviders: {
		discord: {
			clientId: process.env.DISCORD_CLIENT_ID!,
			clientSecret: process.env.DISCORD_CLIENT_SECRET!,
		},
		github: {
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		},
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		},
	},
	user: {
		deleteUser: {
			enabled: true,
		},
	},
});
