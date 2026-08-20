import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import relativeTime from "dayjs/plugin/relativeTime";
import { Menu, PinIcon, PinOffIcon, Share, Trash, User } from "lucide-react";
import { useNavigate } from "react-router";
import type { Post } from "@/hooks/posts/queries";
import { useDeletePost, usePatchPost } from "../../hooks/posts/queries";
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
import { privacyLabels } from "./Composer";

dayjs.extend(relativeTime);
dayjs.extend(isToday);

export function PostCard({
	postData,
	currentUid,
	showPin,
}: {
	postData: Post;
	currentUid?: string;
	showPin: boolean;
}) {
	const { mutate: mutDel, isPending: isPendingDel } = useDeletePost();
	const { mutate: mutPost, isPending: isPendingMut } = usePatchPost();
	const deletePost = (nanoid: string) => {
		mutDel(nanoid, {
			onError: () =>
				toast.add({ title: "Failed to delete post.", type: "error" }),
		});
	};

	const sharePost = () => {
		const postUrl = new URL(window.location.origin);
		postUrl.pathname = "/posts";
		postUrl.searchParams.set("id", postData.nanoid);
		navigator.clipboard.writeText(postUrl.toString());
	};
	const nav = useNavigate();

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
				<span className="flex flex-row justify-center items-center gap-2">
					<Button
						variant="ghost"
						className="flex flex-row justify-center items-center gap-1 p-1"
						onClick={() => nav(`/user/${postData.author.username}`)}
					>
						{postData.author.image ? (
							<img alt="Avatar" src={postData.author.image} />
						) : (
							<User />
						)}
						<p>{postData.author.displayUsername}</p>
					</Button>
					{(postData.author.id === currentUid ||
						postData.privacy === "unlisted") && (
						<p className="flex flex-row gap-1 text-xs text-muted items-center">
							{privacyLabels.find((pl) => pl.value === postData.privacy)?.label}
						</p>
					)}
					{showPin && (
						<p className="flex flex-row gap-1 text-xs text-muted items-center">
							<PinIcon /> Pinned
						</p>
					)}
				</span>
				<span className="flex flex-row justify-center items-center gap-4">
					<p className="flex flex-row gap-1 text-xs text-muted-foreground items-center">
						{dayjs(postData.createdAt).isToday()
							? dayjs(postData.createdAt).fromNow()
							: dayjs(postData.createdAt).toDate().toLocaleDateString()}
					</p>
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
								<DropdownMenuItem onClick={() => sharePost()}>
									<Share /> Share
								</DropdownMenuItem>
							</DropdownMenuGroup>
							{currentUid === postData.author.id && (
								<DropdownMenuGroup>
									<DropdownMenuItem
										onClick={() =>
											mutPost({
												postData: { pinned: !postData.pinned },
												postNanoid: postData.nanoid,
											})
										}
									>
										{postData.pinned ? (
											<>
												<PinOffIcon /> Unpin
											</>
										) : (
											<>
												<PinIcon /> Pin
											</>
										)}
									</DropdownMenuItem>
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
