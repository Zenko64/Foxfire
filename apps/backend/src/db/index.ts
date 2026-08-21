/**
 * @name Database Core
 * @module db/core
 * @file db/index.ts
 * @description This file returns a instance to the Postgres database.s
 */
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../core/env";

import * as usersSchema from "./auth-schema";
import * as dataSchema from "./schema";

const db = drizzle(new Pool({ connectionString: env.DATABASE_URL }), {
	schema: { ...usersSchema, ...dataSchema },
});

export default db;
