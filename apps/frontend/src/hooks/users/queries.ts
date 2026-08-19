import { useQuery } from "@tanstack/react-query";
import type { InferResponseType } from "hono";
import { client } from "@/lib/client";

export type User = InferResponseType<
	(typeof client.api.auth.user)[":username"]["$get"]
>;

export function useUser(username: string) {
	return useQuery({
		queryKey: ["user", username],
		queryFn: async (): Promise<User> => {
			const data = await client.api.auth.user[":username"].$get({
				param: { username },
			});
			if (!data.ok) throw new Error(`Failed to fetch user. ${data.status}`);
			return data.json();
		},
		enabled: Boolean(username),
	});
}
