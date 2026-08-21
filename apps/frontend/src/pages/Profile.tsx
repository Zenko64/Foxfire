import { BanIcon, Edit, Ghost, User } from "lucide-react";
import { Navigate, useParams, useSearchParams } from "react-router";
import { PostCard } from "@/components/posts/Post";
import { ProfileEditDialog } from "@/components/profile/ProfileEditor";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { usePost, usePosts } from "@/hooks/posts/queries";
import { useUser } from "@/hooks/users/queries";
import { authClient } from "@/lib/auth";

export function Profile() {
	// Account data
	const { username: usernamePathParam } = useParams();
	const { data: session, isPending } = authClient.useSession();

	const profileUsername = usernamePathParam ?? session?.user.username;
	const { data, error } = useUser(profileUsername ?? "", {
		enabled: Boolean(profileUsername),
	});

	// Account content
	const { data: posts } = usePosts(
		{ author: data?.username ?? "" },
		{ enabled: Boolean(data?.username) },
	);

	// Shared Posts
	const [searchParams] = useSearchParams();
	const sharedPostId = searchParams.get("id");
	const { data: sharedPost } = usePost(sharedPostId ?? "", {
		enabled: Boolean(sharedPostId),
	});

	const isOwner = session?.user.username === data?.username;

	if (!usernamePathParam) {
		if (isPending) return null;
		if (!session)
			return (
				<div className="items-center justify-center flex flex-1 flex-col">
					<Empty>
						<EmptyHeader>
							<EmptyMedia>
								<BanIcon />
							</EmptyMedia>
							<EmptyTitle>Unauthorized</EmptyTitle>
							<EmptyDescription>
								You need an account to access this page.
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				</div>
			);
		return <Navigate to={`/user/${session.user.username}`} replace />;
	}

	if (!data || error?.status === 404) {
		return (
			<div className="items-center justify-center flex flex-1 flex-col">
				<Empty>
					<EmptyHeader>
						<EmptyMedia>
							<Ghost />
						</EmptyMedia>
						<EmptyTitle>404</EmptyTitle>
						<EmptyDescription>
							The requested user wasn't found.
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			</div>
		);
	}

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
					{isOwner && data && (
						<Dialog>
							<DialogTrigger
								render={
									<Button variant="outline">
										<Edit />
										Edit
									</Button>
								}
							/>
							<ProfileEditDialog user={data} />
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
