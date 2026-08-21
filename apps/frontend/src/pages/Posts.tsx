import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Composer } from "@/components/posts/Composer";
import { PostCard } from "@/components/posts/Post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { type Post, usePost, usePosts } from "@/hooks/posts/queries";
import { useDebounce } from "@/hooks/useDebounce";
import { authClient } from "@/lib/auth";
import { cn } from "../lib/utils";

export function Posts() {
	const { data: session } = authClient.useSession();
	const [searchParams, setSearchParam] = useSearchParams();

	// Post Data
	const [search, setSearch] = useState("");
	const { data: posts } = usePosts({ query: useDebounce(search, 300) });

	// Shared Posts
	const sharedPostId = searchParams.get("id");
	const { data: sharedPost } = usePost(sharedPostId ?? "", {
		enabled: Boolean(sharedPostId),
	});

	// Composer
	const [composer, setComposer] = useState<{ edit?: Post }>();
	useEffect(() => {
		if ((composer || search) && sharedPostId) {
			setSearchParam((prev) => {
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

	return (
		<div className="main-center">
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
					?.filter(
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
