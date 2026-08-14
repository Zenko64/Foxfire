import { factory } from "../../core/http/factory";
import { auth } from "../../lib/auth";

const authRouter = factory
	.createApp({
		strict: false,
	})
	.on(["POST", "GET"], "/*", (c) => auth.handler(c.req.raw));

export default authRouter;
