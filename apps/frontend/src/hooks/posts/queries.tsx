import {
	type UseMutationOptions,
	type UseQueryOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono/client";
import { client } from "@/lib/client";

export type Post = InferResponseType<typeof client.api.posts.$get, 200>[number];
type InsertPost = InferRequestType<typeof client.api.posts.$post>["json"];
type PatchPost = InferRequestType<
	(typeof client.api.posts)[":nanoid"]["$patch"]
>["json"];

export function usePosts(
	params?: { query?: string; author?: string },
	options?: Partial<UseQueryOptions<Post[]>>,
) {
	return useQuery({
		queryKey: ["posts", params],
		queryFn: async (): Promise<Post[]> => {
			const data = await client.api.posts.$get({ query: params ?? {} });
			if (!data.ok) throw new Error(`Failed to fetch posts. ${data.status}`);
			return data.json();
		},
		...options,
	});
}

export function usePost(
	nanoid: string,
	options?: Partial<UseQueryOptions<Post>>,
) {
	return useQuery({
		queryKey: ["post", nanoid],
		queryFn: async (): Promise<Post> => {
			if (!nanoid)
				throw new Error("A nanoid is required to fetch a single post.");
			const data = await client.api.posts[":nanoid"].$get({
				param: { nanoid },
			});
			if (!data.ok) throw new Error(`Failed to fetch post. ${data.status}`);
			return data.json();
		},
		...options,
	});
}

export function useCreatePost(
	options?: Partial<UseMutationOptions<Post, Error, InsertPost>>,
) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (postData: InsertPost): Promise<Post> => {
			const data = await client.api.posts.$post({ json: postData });
			if (!data.ok) throw new Error(`Failed to create post. ${data.status}`);
			return data.json();
		},
		onSuccess: (newData: Post) => {
			queryClient.setQueriesData<Post[]>({ queryKey: ["posts"] }, (prev) =>
				prev ? [newData, ...prev] : [newData],
			);
		},
		...options,
	});
}

export function useDeletePost(
	options?: Partial<UseMutationOptions<boolean, Error, string>>,
) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (nanoid: string) => {
			const data = await client.api.posts[":nanoid"].$delete({
				param: { nanoid },
			});
			if (!data.ok) throw new Error(`Failed to delete post. ${data.status}`);
			return true;
		},
		onSuccess: (_data, nanoid: string) => {
			queryClient.setQueriesData<Post[]>({ queryKey: ["posts"] }, (prev) =>
				prev?.filter((el) => el.nanoid !== nanoid),
			);
		},
		...options,
	});
}

export function usePatchPost(
	options?: Partial<
		UseMutationOptions<Post, Error, { postData: PatchPost; postNanoid: string }>
	>,
) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (args: { postData: PatchPost; postNanoid: string }) => {
			const data = await client.api.posts[":nanoid"].$patch({
				param: { nanoid: args.postNanoid },
				json: args.postData,
			});
			if (!data.ok) throw new Error(`Failed to create post. ${data.status}`);
			return data.json();
		},
		onSuccess: (updatedPost: Post) => {
			queryClient.setQueriesData<Post[]>(
				{ queryKey: ["posts"] },
				(prev) =>
					prev?.map((p) =>
						p.nanoid === updatedPost.nanoid ? updatedPost : p,
					) ?? [],
			);
		},
		...options,
	});
}
