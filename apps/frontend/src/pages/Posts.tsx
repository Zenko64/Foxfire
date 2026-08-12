import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Post } from "@/components/posts/Post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "../lib/utils";

export function Posts() {
	const [showNewPost, setShowNewPost] = useState<boolean>(true);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 50) return setShowNewPost(false);
			setShowNewPost(true);
		};
		window.addEventListener("scroll", handleScroll);

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div className="main-center">
			<div className="flex flex-row justify-between items-center p-2">
				<Input placeholder="Search posts..." className="w-full sm:w-1/3" />
				<Button
					className={cn(
						"hover:cursor-pointer fixed bottom-4 right-4 flex items-center justify-center sm:static sm:gap-2 max-sm:size-14",
						!showNewPost && "hidden",
					)}
				>
					<Plus className="size-8 sm:size-4" />
					<span className="hidden sm:inline">New Post</span>
				</Button>
			</div>
			<Separator />
			<div className="flex flex-col p-4 gap-2">
				<Post />
				<Post />
				<Post />
				<Post />
			</div>
		</div>
	);
}
