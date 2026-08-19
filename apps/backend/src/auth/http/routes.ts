import { factory } from "../../core/http/factory";
import { auth } from "../../lib/auth";
import { getUser } from "../service";

const authRouter = factory
	.createApp({
		strict: false,
	})
	.on(["POST", "GET"], "/*", (c) => auth.handler(c.req.raw))
	.get("/user/:username", async (c) => {
		const username = c.req.param("username");

		return c.json(await getUser({ username }));
	});
export default authRouter;
