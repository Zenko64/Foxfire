import { User } from "lucide-react";
import { useParams, useSearchParams } from "react-router";
import { PostCard } from "@/components/posts/Post";
import { Separator } from "@/components/ui/separator";
import { usePost, usePosts } from "@/hooks/posts/queries";
import { useUser } from "@/hooks/users/queries";
import { authClient } from "@/lib/auth";

export function Profile() {
	// Account data
	const { username: usernameParam } = useParams();
	const { data: session } = authClient.useSession();
	const { data } = useUser(usernameParam ?? session?.user.username ?? "");

	// Account content
	const { data: posts } = usePosts(
		{ author: data?.username ?? "" },
		{ enabled: Boolean(data?.username) },
	);

	const [searchParams] = useSearchParams();
	const sharedPostId = searchParams.get("id");

	// Shared Posts
	const { data: sharedPost } = usePost(sharedPostId ?? "", {
		enabled: sharedPostId !== null,
	});

	return (
		<div className="main-center flex flex-col">
			<div className="flex flex-row p-8">
				{data?.image ? (
					<img alt="Avatar" src={data.image} className="size-32" />
				) : (
					<User className=" border p-4 size-20" />
				)}
				<div className="flex flex-col items-start justify-start pl-4">
					<p className="text-xl">{data?.displayUsername}</p>
					<p className="text-xs text-muted-foreground">@{data?.username}</p>
				</div>
			</div>
			<Separator />
			{sharedPost && (
				<>
					<div className="flex flex-col p-4 gap-2">
						<PostCard postData={sharedPost} currentUid={session?.user.id} />
					</div>
					<Separator />
				</>
			)}
			<div className="flex flex-col p-4 gap-2">
				{posts
					?.toSorted((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
					.filter((p) => p.nanoid !== sharedPost?.nanoid)
					.map((p) => (
						<PostCard
							key={p.nanoid}
							postData={p}
							currentUid={session?.user.id}
						/>
					))}
			</div>
		</div>
	);
}
