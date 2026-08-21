/**
 * @name Foxfire Schema
 * @description This file contains the database schema for data related to the app. (excluding authentication-related data)
 * @module db/schema
 * @file db/schema.ts
 */
import { relations } from "drizzle-orm";
import {
	boolean,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const privacyEnum = pgEnum("privacy", ["public", "unlisted", "private"]);

export const postsTable = pgTable("posts", {
	id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
	authorId: text("author_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	nanoid: varchar("nanoid", { length: 21 }).notNull().unique(),
	text: varchar("text", { length: 4000 }).notNull(),
	pinned: boolean("pinned").notNull().default(false),
	privacy: privacyEnum("privacy").notNull().default("public"),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
		() => new Date(),
	),
});

export const postRelations = relations(postsTable, ({ one }) => ({
	author: one(user, { fields: [postsTable.authorId], references: [user.id] }),
}));
export const userRelations = relations(user, ({ many }) => ({
	posts: many(postsTable),
}));
