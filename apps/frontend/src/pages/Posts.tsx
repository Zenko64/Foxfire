import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Composer } from "@/components/posts/Composer";
import { PostCard } from "@/components/posts/Post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { usePosts } from "@/hooks/posts/queries";
import { useDebounce } from "@/hooks/useDebounce";
import { authClient } from "@/lib/auth";
import { cn } from "../lib/utils";

export function Posts() {
	const [showComposer, setShowComposer] = useState<boolean>(false);
	const [search, setSearch] = useState("");
	const debouncedSearch = useDebounce(search, 300);
	const { data: posts } = usePosts({ query: debouncedSearch || undefined });
	const { data: session } = authClient.useSession();

	// Mobile Composer Button
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
					placeholder="Search posts..."
					onChange={(e) => setSearch(e.target.value)}
					className="w-full sm:w-1/3"
				/>
				{session && (
					<Button
						className={cn(
							"hover:cursor-pointer fixed bottom-4 right-4 flex items-center justify-center sm:static sm:gap-2 max-sm:size-14",
							!showComposerTrigger || (showComposer && "hidden"),
						)}
						onClick={() => setShowComposer(true)}
					>
						<Plus className="size-8 sm:size-4" />
						<span className="hidden sm:inline">New Post</span>
					</Button>
				)}
			</div>
			<Separator />
			{showComposer && (
				<>
					<div className="flex flex-col p-4 gap-2">
						<Composer onComplete={() => setShowComposer(false)} />
					</div>
					<Separator />
				</>
			)}

			<div className="flex flex-col p-4 gap-2">
				{posts?.map((p) => (
					<PostCard key={p.nanoid} postData={p} currentUid={session?.user.id} />
				))}
			</div>
		</div>
	);
}
