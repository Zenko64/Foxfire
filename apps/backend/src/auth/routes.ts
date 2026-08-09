import { Hono } from "hono";
import { auth } from "../lib/auth";

const authRouter = new Hono({
	strict: false,
});

authRouter.on(["POST", "GET"], "/*", (c) => auth.handler(c.req.raw));

export default authRouter;
