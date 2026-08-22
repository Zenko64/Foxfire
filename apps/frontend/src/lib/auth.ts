import { anonymousClient, usernameClient } from "better-auth/client/plugins";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: "http://localhost:5173",
	basePath: "/api/auth",
	plugins: [usernameClient(), anonymousClient()],
});
