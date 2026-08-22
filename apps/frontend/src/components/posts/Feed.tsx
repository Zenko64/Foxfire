import { Ghost, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Composer } from "@/components/posts/Composer";
import { PostCard } from "@/components/posts/Post";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { type Post, usePosts } from "@/hooks/posts/queries";
import { useDebounce } from "@/hooks/useDebounce";
import { authClient } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useDeletePost } from "../../hooks/posts/queries";
import { toast } from "../ui/toast";
import { SharedPost } from "./SharedPost";

interface Props {
	author?: string;
	enableComposer?: boolean;
	enableSearch?: boolean;
}

export function PostsFeed({
	enableComposer = true,
	enableSearch = true,
	...props
}: Props) {
	const { data: session } = authClient.useSession();
	const [searchParams, setSearchParams] = useSearchParams();

	// State
	const [search, setSearch] = useState<string>("");
	const { data: posts } = usePosts({
		query: useDebounce(search, 300),
		author: props.author,
	});
	const [sharedPostId, setSharedPostId] = useState(
		searchParams.get("id") ?? undefined,
	);
	const isAuthor = props.author === session?.user.username;

	// Composer
	const [composer, setComposer] = useState<{ edit?: Post }>();

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

	// Actions
	const { mutate: deletePostMut } = useDeletePost();
	const deletePost = (postId: string) => {
		deletePostMut(postId);
		if (sharedPostId === postId) {
			setSharedPostId(undefined);
		}
	};
	const sharePost = (postId: string) => {
		const postUrl = new URL(window.location.href);
		postUrl.searchParams.set("id", postId);
		navigator.clipboard
			.writeText(postUrl.toString())
			.catch(() =>
				toast.add({
					type: "error",
					title: "Failed to copy post to clipboard.",
					description: "Unable to access the clipboard.",
				}),
			)
			.then(() =>
				toast.add({ type: "success", title: "Copied post link to clipboard." }),
			);
	};

	// Effects
	useEffect(() => {
		if (sharedPostId && (composer || search)) {
			setSharedPostId(undefined);
		}
	}, [search, composer]);
	useEffect(() => {
		if (!sharedPostId && searchParams.has("id")) {
			setSearchParams(
				(prev) => {
					prev.delete("id");
					return prev;
				},
				{ replace: true },
			);
		}
	}, [sharedPostId]);

	return (
		<div className="flex flex-1 flex-col">
			<div className="flex flex-row justify-between items-center p-2">
				{enableSearch && (
					<Input
						value={search}
						placeholder="Search posts..."
						onChange={(e) => setSearch(e.target.value)}
						className="w-full sm:w-1/3"
					/>
				)}
				{session && enableComposer && (
					<Button
						className={cn(
							"hover:cursor-pointer fixed bottom-4 right-4 flex items-center justify-center sm:static sm:gap-2 max-sm:size-14",
							composer && "hidden",
							!showComposerTrigger && "max-sm:hidden",
						)}
						onClick={() => setComposer({})}
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
							onComplete={() => setComposer(undefined)}
							edit={composer.edit}
							key={composer.edit?.nanoid ?? "newPost"}
						/>
					</div>
					<Separator />
				</>
			)}
			{sharedPostId && (
				<>
					<div className="flex flex-col p-4 gap-2">
						<SharedPost
							postId={sharedPostId}
							onShare={sharePost}
							onEdit={(post) => setComposer({ edit: post })}
							onDelete={deletePost}
						/>
					</div>
					<Separator />
				</>
			)}

			{posts && posts.length > 0 ? (
				<div className="flex flex-col p-4 gap-2">
					{posts
						?.filter(
							(p) =>
								p.nanoid !== sharedPostId &&
								p.nanoid !== composer?.edit?.nanoid,
						)
						.map((p) => (
							<PostCard
								key={p.nanoid}
								postData={p}
								onShare={sharePost}
								showCreatedAt
								showPrivacyLevels={
									session?.user.username === p.author.username
										? ["private", "unlisted", "public"]
										: undefined
								}
								{...(p.author.id === session?.user.id && {
									onEdit: (post) => setComposer({ edit: post }),
									onDelete: deletePost,
								})}
							/>
						))}
				</div>
			) : search ? (
				<Empty>
					<EmptyHeader>
						<EmptyMedia>
							<Ghost />
						</EmptyMedia>
						<EmptyTitle>No Results</EmptyTitle>
						<EmptyDescription>
							We looked everywhere, and found nothing...
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			) : !composer ? (
				<Empty>
					<EmptyHeader>
						<EmptyMedia>
							<Ghost />
						</EmptyMedia>
						<EmptyTitle>No Posts Yet...</EmptyTitle>
						<EmptyDescription>
							{session && !props.author
								? "No one has posted anything yet, but you could be the first!"
								: !isAuthor
									? "Seems like they have't posted anything yet...\nCome back later!"
									: isAuthor
										? "You haven't posted anything yet...\nUse the button below and get started!"
										: null}
						</EmptyDescription>
						<EmptyContent>
							{((session && !props.author) || (session && isAuthor)) && (
								<Button onClick={() => setComposer({})}>
									<Plus /> New Post
								</Button>
							)}
						</EmptyContent>
					</EmptyHeader>
				</Empty>
			) : null}
		</div>
	);
}
