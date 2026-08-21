import { Edit, User } from "lucide-react";
import { useParams, useSearchParams } from "react-router";
import { PostCard } from "@/components/posts/Post";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { usePost, usePosts } from "@/hooks/posts/queries";
import { useUser } from "@/hooks/users/queries";
import { authClient } from "@/lib/auth";

export function Profile() {
	const [searchParams] = useSearchParams();

	// Account data
	const { username: usernameParam } = useParams();
	const { data: session } = authClient.useSession();

	const profileUsername = usernameParam ?? session?.user.username;
	const { data } = useUser(profileUsername ?? "", {
		enabled: Boolean(profileUsername),
	});

	// Account content
	const { data: posts } = usePosts(
		{ author: data?.username ?? "" },
		{ enabled: Boolean(data?.username) },
	);

	// Shared Posts
	const sharedPostId = searchParams.get("id");
	const { data: sharedPost } = usePost(sharedPostId ?? "", {
		enabled: Boolean(sharedPostId),
	});

	const isOwner = session?.user.username === data?.username;

	return (
		<div className="main-center flex flex-col">
			<div className="flex flex-row p-8 justify-between">
				<div className="flex flex-row">
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
				<div className="flex flex-row">
					{/** TODO: Implement Profile Editor in dedicated component file */}
					{isOwner && (
						<Dialog>
							<DialogTrigger
								render={
									<Button variant="outline">
										<Edit />
										Edit
									</Button>
								}
							/>
							<DialogContent>
								{data?.image ? (
									<img alt="Avatar" src={data.image} className="size-15" />
								) : (
									<User className=" border p-4 size-15" />
								)}
							</DialogContent>
						</Dialog>
					)}
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
