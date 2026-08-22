import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { testUtils, username } from "better-auth/plugins";
import * as schema from "../../src/db/auth-schema";
import db from "./db";

const auth = betterAuth({
	database: drizzleAdapter(db, { provider: "pg", schema }),
	baseURL: process.env.APP_URL,
	emailAndPassword: { enabled: true },
	plugins: [
		username({
			minUsernameLength: 3,
			maxUsernameLength: 30,
		}),
		testUtils(),
	],
	user: {
		deleteUser: {
			enabled: true,
		},
	},
});

export const test = (await auth.$context).test;

export default auth;
