import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../core/env";
import { Pool } from "pg";

import * as usersSchema from "./auth-schema";
import * as dataSchema from "./schema";

const db = drizzle(new Pool({ connectionString: env.DATABASE_URL }), {
  schema: { ...usersSchema, ...dataSchema },
});

export default db;
