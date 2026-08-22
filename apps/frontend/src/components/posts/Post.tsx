import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import relativeTime from "dayjs/plugin/relativeTime";
import { Edit, Menu, Share, Trash, User } from "lucide-react";
import { useNavigate } from "react-router";
import type { Post } from "@/hooks/posts/queries";
import type { PrivacyLevel } from "@/types";
import { privacyLabels } from "../constants/Privacy";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

dayjs.extend(relativeTime);
dayjs.extend(isToday);

export function PostCard({
	postData,
	showPrivacyLevels,
	showCreatedAt,
	onShare,
	onEdit,
	onDelete,
}: {
	postData: Post;
	showPrivacyLevels?: PrivacyLevel[];
	showCreatedAt?: boolean;
	onShare?: (postId: string) => void;
	onEdit?: (post: Post) => void;
	onDelete?: (postId: string) => void;
}) {
	const nav = useNavigate();

	return (
		<div className=" min-w-full w-full h-full min-h-40 bg-card border flex flex-col">
			<div className="flex-1 flex flex-col min-h-0">
				<div className="flex-1 p-4">{postData.text}</div>
			</div>
			<div className="flex flex-row items-center border-t justify-between gap-2 px-2 py-2 bg-transparent">
				<span className="flex flex-row justify-center items-center gap-2.5">
					<Button
						variant="ghost"
						className="flex flex-row justify-center items-center gap-1 p-1"
						onClick={() =>
							!window.location.pathname.startsWith("/user") &&
							nav(`/user/${postData.author.username}`)
						}
					>
						{postData.author.image ? (
							<img
								alt="Avatar"
								className="size-8"
								src={postData.author.image}
							/>
						) : (
							<User />
						)}
						<p>{postData.author.displayUsername}</p>
					</Button>
					{/*// ? If the post is unlisted, the viewer must know it at all times, regardless of the showPrivacyLevels set (usually author-exclusive) //*/}
					{(showPrivacyLevels?.includes(postData.privacy) ||
						postData.privacy === "unlisted") && (
						<p className="flex flex-row gap-1 text-xs text-muted-foreground items-center">
							{privacyLabels.find((pl) => pl.value === postData.privacy)?.label}
						</p>
					)}
				</span>
				<span className="flex flex-row justify-center items-center gap-4">
					{/* Display date posted */}
					{showCreatedAt && (
						<p className="flex flex-row gap-1 text-xs text-muted-foreground items-center">
							{dayjs(postData.createdAt).isToday()
								? dayjs(postData.createdAt).fromNow()
								: dayjs(postData.createdAt).toDate().toLocaleDateString()}
						</p>
					)}
					<DropdownMenu>
						<DropdownMenuTrigger
							render={(props) => (
								<Button {...props} size="icon" variant="outline">
									<Menu />
								</Button>
							)}
						/>
						<DropdownMenuContent align="end">
							<DropdownMenuGroup>
								{onShare && (
									<DropdownMenuItem onClick={() => onShare(postData.nanoid)}>
										<Share /> Share
									</DropdownMenuItem>
								)}
							</DropdownMenuGroup>
							<DropdownMenuGroup>
								{onEdit && (
									<DropdownMenuItem onClick={() => onEdit(postData)}>
										<Edit />
										Edit Post
									</DropdownMenuItem>
								)}

								{onDelete && (
									<DropdownMenuItem
										variant="destructive"
										onClick={() => onDelete(postData.nanoid)}
									>
										<Trash />
										Delete
									</DropdownMenuItem>
								)}
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</span>
			</div>
		</div>
	);
}
