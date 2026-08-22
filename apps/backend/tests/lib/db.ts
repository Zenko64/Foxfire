import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import * as authSchema from "../../src/db/auth-schema";
import * as schema from "../../src/db/schema";

export const dbClient = new PGlite();

const db = drizzle({
	client: dbClient,
	schema: { ...authSchema, ...schema },
});
await migrate(db, {
	migrationsFolder: path.join(import.meta.dirname, "..", "..", "drizzle"),
});

export default db;
