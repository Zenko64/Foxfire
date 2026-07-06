import { and, eq, ilike, or } from "drizzle-orm";
import db from "../db";

/**
 * @name getPosts
 * @description Queries The Posts Table.
 * @param { query, authorId } - Filters.
 * @param userId - Logged In UserID, to return private user data.
 * @returns
 */
export async function queryPosts(
  { query, authorId }: { query?: string; authorId?: string },
  userId?: string,
) {
  return await db.transaction((tx) => {
    return tx.query.postsTable.findMany({
      where: (r) => {
        const conditions = [];

        or(
          eq(r.privacy, "public"),
          userId ? eq(r.authorId, userId) : undefined,
        );

        if (query) conditions.push(ilike(r.text, `%${query}%`));
        if (authorId) conditions.push(eq(r.authorId, authorId));

        return and(...conditions);
      },
      columns: {
        createdAt: true,
        nanoid: true,
        pinned: true,
        privacy: true,
        text: true,
      },
      with: {
        author: {
          columns: {
            image: true,
            name: true,
          },
        },
      },
    });
  });
}
