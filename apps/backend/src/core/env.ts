/**
 * @file core/env.ts
 * @name Environment Validator
 * @description This file exports the environment in a safer manner, the environment is verified using zod.
 * @module core/env
 */
import z from "zod";

const envSchema = z.object({
	HOST: z.string().default("127.0.0.1"),
	PORT: z
		.string()
		.default("4000")
		.transform(Number)
		.refine((val: number) => val > 0 && val < 65536, {
			message: "The Port Number Is Invalid.",
		}),
	DATABASE_URL: z
		.string()
		.min(1, "The PostgreSQL Connection URL Is Missing In The .env"),
	REDIS_URL: z
		.string()
		.min(1, "The Redis Connection URL Is Missing In The .env"),
	APP_URL: z.string().min(1, "The App URL Is Missing."),
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
});

export const env = envSchema.parse(process.env);
