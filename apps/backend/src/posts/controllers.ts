import type { Context } from "hono";
import { queryPosts } from "./handlers";
import db from "../db";
import { eq } from "drizzle-orm";

export async function getPosts(c: Context) {
  const { query, author } = c.req.param();

  const authorId = author
    ? (
        await db.query.user.findFirst({
          where: (u) => eq(u.username, author),
          columns: { id: true },
        })
      )?.id
    : undefined;

  try {
    queryPosts({
      query,
      authorId,
    });
  } catch (e) {
    console.error("Query Failed: ", e);
  }
}
