import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import path from "path";

import * as schema from "../../src/db/schema";
import * as authSchema from "../../src/db/auth-schema";

const db = drizzle({
  client: new PGlite(),
  schema: { ...authSchema, ...schema },
});
await migrate(db, {
  migrationsFolder: path.join(import.meta.dirname, "..", "..", "drizzle"),
});

export default db;
