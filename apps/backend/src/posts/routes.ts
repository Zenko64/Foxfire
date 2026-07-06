import { Hono } from "hono";
import { getPosts } from "./controllers";

const postsRouter = new Hono().get("/", getPosts);

export default postsRouter;
