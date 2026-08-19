import { Menu, Trash, User } from "lucide-react";
import type { Post } from "@/hooks/posts/queries";
import { useDeletePost } from "../../hooks/posts/queries";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

export function PostCard({
	postData,
	currentUid,
}: {
	postData: Post;
	currentUid?: string;
}) {
	const { mutate: mutDel, isPending: isPendingDel } = useDeletePost();
	const deletePost = (nanoid: string) => {
		mutDel(nanoid, {
			onError: () =>
				toast.add({ title: "Failed to delete post.", type: "error" }),
		});
	};

	return (
		<div className="relative min-w-full w-full h-full min-h-40 bg-card border flex flex-col">
			<div className="relative flex-1 flex flex-col min-h-0">
				{isPendingDel && (
					<div className="absolute bg-neutral-800/2 backdrop-blur-sm h-full w-full flex flex-row gap-2 justify-center items-center">
						<Spinner /> Deleting...
					</div>
				)}
				<div className="flex-1 p-4">{postData.text}</div>
			</div>

			<div className="flex flex-row items-center border-t justify-between gap-2 px-2 py-2 bg-transparent">
				<span className="flex flex-row justify-center items-center gap-1">
					{postData.author.image ? (
						<img alt="Avatar" src={postData.author.image} />
					) : (
						<User />
					)}
					<p>{postData.author.displayUsername}</p>
				</span>

				<span className="flex flex-row justify-center items-center gap-1">
					<p className="text-muted">{}</p>
					<DropdownMenu>
						<DropdownMenuTrigger
							render={(props) => (
								<Button {...props} size="icon" variant="outline">
									<Menu />
								</Button>
							)}
						/>
						<DropdownMenuContent align="end">
							{currentUid === postData?.author.id && (
								<DropdownMenuGroup>
									<DropdownMenuItem
										variant="destructive"
										onClick={() => deletePost(postData.nanoid)}
									>
										<Trash />
										Delete
									</DropdownMenuItem>
								</DropdownMenuGroup>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</span>
			</div>
		</div>
	);
}
