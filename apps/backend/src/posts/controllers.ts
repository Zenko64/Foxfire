import type { Context } from "hono";
import * as handlers from "./handlers";
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
    handlers.getPosts({
      query,
      authorId,
    });
  } catch (e) {
    console.error("Query Failed: ", e);
  }
}

export async function getPost(c: Context) {}
export async function createPost(c: Context) {}
export async function patchPost(c: Context) {}
export async function deletePost(c: Context) {}
