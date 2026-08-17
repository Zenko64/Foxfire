import { Menu, User } from "lucide-react";
import type { Post } from "@/hooks/posts/queries";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function PostCard({ postData }: { postData: Post }) {
	return (
		<div className="min-w-full w-full h-full min-h-40 bg-card border flex flex-col">
			<div className="flex-1 p-2">{postData.text}</div>

			<div className="flex flex-row items-center border-t justify-between gap-2 px-2 py-2 bg-transparent">
				<span className="flex flex-row justify-center items-center gap-1">
					{postData.author.image ? (
						<img alt="Avatar" src={postData.author.image} />
					) : (
						<User />
					)}
					<p>{postData.author.displayUsername}</p>
				</span>
				<DropdownMenu>
					<DropdownMenuTrigger
						render={() => (
							<Button size="icon" variant="outline">
								<Menu />
							</Button>
						)}
					/>
					<DropdownMenuContent></DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
