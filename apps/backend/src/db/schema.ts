import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema";

export const privacyEnum = pgEnum("privacy", ["public", "private"]);

export const postsTable = pgTable("posts", {
  id: text("id").primaryKey(),
  authorId: text("author_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  nanoid: varchar("nanoid", { length: 21 }).notNull().unique(),
  text: text("text").notNull(),
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
