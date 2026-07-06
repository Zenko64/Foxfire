import { Hono } from "hono";
import authRouter from "./auth/routes";
import postsRouter from "./posts/routes";

const app = new Hono()
  .route("/api/auth", authRouter)
  .route("/api/posts", postsRouter);

export default app;
export type AppType = typeof app;
