/**
 * @name Database Core
 * @module db/core
 * @file db/index.ts
 * @description This file returns an instance of the Postgres database.
 */

import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { env } from "../core/env";
import * as usersSchema from "./auth-schema";
import * as dataSchema from "./schema";

const db = drizzle(new Pool({ connectionString: env.DATABASE_URL }), {
	schema: { ...usersSchema, ...dataSchema },
});

sql`SELECT 1`;
await migrate(db, { migrationsFolder: "./drizzle" });

export default db;
