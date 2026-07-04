import { Elysia } from "elysia";
import videosRouter from "./videos/routes";
import postsRouter from "./posts/routes";

const app = new Elysia()
  .mount("/api/videos", videosRouter)
  .mount("/api/posts", postsRouter).listen(4000);

console.log(
  `🦊 Vector is running at: ${app.server?.hostname}:${app.server?.port}`,
);
