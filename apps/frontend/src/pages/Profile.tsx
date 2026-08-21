import { BanIcon, Edit, Ghost, Plus, User } from "lucide-react";
import { useEffect, useState } from "react";
import {
	Navigate,
	useNavigate,
	useParams,
	useSearchParams,
} from "react-router";
import { Composer } from "@/components/posts/Composer";
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { type Post, usePost, usePosts } from "@/hooks/posts/queries";
import { useDebounce } from "@/hooks/useDebounce";
import { useUser } from "@/hooks/users/queries";
import { authClient } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function Profile() {
	const nav = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	// State
	const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);

	// Account data
	const { username: usernamePathParam } = useParams();
	const { data: session, isPending } = authClient.useSession();

	const profileUsername = usernamePathParam ?? session?.user.username;
	const { data, error } = useUser(profileUsername ?? "", {
		enabled: Boolean(profileUsername),
	});

	// Post Data
	const [search, setSearch] = useState("");
	const { data: posts } = usePosts(
		{ author: data?.username ?? "", query: useDebounce(search, 300) },
		{ enabled: Boolean(data?.username) },
	);

	// Shared Posts
	const sharedPostId = searchParams.get("id");
	const { data: sharedPost } = usePost(sharedPostId ?? "", {
		enabled: Boolean(sharedPostId),
	});

	const isOwner = session?.user.username === data?.username;

	// Composer
	const [composer, setComposer] = useState<{ edit?: Post } | null>(null);
	useEffect(() => {
		if ((composer || search) && sharedPostId) {
			setSearchParams((prev) => {
				prev.delete("id");
				return prev;
			});
		}
	}, [composer, search]);

	// Mobile Optimizations for the compose trigger
	const [showComposerTrigger, setShowComposerTrigger] = useState<boolean>(true);
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 50) return setShowComposerTrigger(false);
			setShowComposerTrigger(true);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

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
					{isOwner && session && (
						<Dialog onOpenChange={setIsEditingProfile} open={isEditingProfile}>
							<DialogTrigger
								render={
									<Button variant="outline">
										<Edit />
										Edit
									</Button>
								}
							/>
							<ProfileEditDialog
								onSuccess={(data) => {
									setIsEditingProfile(false);
									if (data.username !== session.user.username)
										nav(`/user/${data.username}`);
								}}
							/>
						</Dialog>
					)}
				</div>
			</div>
			<Separator />
			<div className="flex flex-row justify-between items-center p-2">
				<Input
					value={search}
					placeholder="Search posts..."
					onChange={(e) => setSearch(e.target.value)}
					className="w-full sm:w-1/3"
				/>
				{session && (
					<Button
						className={cn(
							"hover:cursor-pointer fixed bottom-4 right-4 flex items-center justify-center sm:static sm:gap-2 max-sm:size-14",
							(!showComposerTrigger || composer) && "hidden",
						)}
						onClick={() => {
							setComposer({});
						}}
					>
						<Plus className="size-8 sm:size-4" />
						<span className="hidden sm:inline">New Post</span>
					</Button>
				)}
			</div>
			<Separator />
			{composer && (
				<>
					<div className="flex flex-col p-4 gap-2">
						<Composer
							onComplete={() => setComposer(null)}
							edit={composer?.edit}
							key={composer.edit?.nanoid ?? "newPost"}
						/>
					</div>
					<Separator />
				</>
			)}
			{sharedPost && (
				<>
					<div className="flex flex-col p-4 gap-2">
						<PostCard
							postData={sharedPost}
							currentUid={session?.user.id}
							onEdit={(p) => setComposer({ edit: p })}
						/>
					</div>
					<Separator />
				</>
			)}
			<div className="flex flex-col p-4 gap-2">
				{posts
					?.toSorted((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
					.filter(
						(p) =>
							p.nanoid !== sharedPost?.nanoid &&
							p.nanoid !== composer?.edit?.nanoid,
					)
					.map((p) => (
						<PostCard
							key={p.nanoid}
							postData={p}
							currentUid={session?.user.id}
							onEdit={(p) => setComposer({ edit: p })}
						/>
					))}
			</div>
		</div>
	);
}
