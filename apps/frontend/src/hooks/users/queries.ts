import type { ApiErrorData } from "@foxfire/types";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { InferResponseType } from "hono/client";
import { client } from "@/lib/client";
import { ApiError } from "@/lib/errors";

export type User = InferResponseType<
	(typeof client.api.auth.user)[":username"]["$get"]
>;

export function useUser(
	username?: string,
	options?: Partial<UseQueryOptions<User, ApiError>>,
) {
	return useQuery({
		queryKey: ["user", username],
		queryFn: async (): Promise<User> => {
			const data = await client.api.auth.user[":username"].$get({
				param: { username: username ?? "" }, // This assertion is here because by default we only run the query if the username is valid by default, due to the enabled property.
			});
			if (!data.ok)
				throw new ApiError((await data.json()) as ApiErrorData, data.status);
			return data.json();
		},
		enabled: Boolean(username),

		...options,
	});
}
