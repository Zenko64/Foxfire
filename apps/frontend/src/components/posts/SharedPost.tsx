import { TriangleAlert } from "lucide-react";
import { type Post, usePost } from "@/hooks/posts/queries";
import { authClient } from "@/lib/auth";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "../ui/empty";
import { Spinner } from "../ui/spinner";
import { PostCard } from "./Post";

interface Props {
	postId: string;
	onEdit?: (post: Post) => void;
	onDelete?: (postId: string) => void;
	onShare?: (postId: string) => void;
}

export function SharedPost({ postId, onEdit, onDelete, onShare }: Props) {
	const { data, error, isSuccess, isError, isFetching } = usePost(postId);
	const { data: session } = authClient.useSession();

	if (isSuccess) {
		return (
			<PostCard
				postData={data}
				onShare={onShare}
				{...(data.author.id === session?.user.id && {
					onEdit: onEdit,
					onDelete: onDelete,
				})}
				showCreatedAt
				showPrivacyLevels={
					session?.user.username === data.author.username
						? ["private", "unlisted", "public"]
						: undefined
				}
			/>
		);
	}

	if (isError) {
		return (
			<Empty>
				<EmptyHeader>
					<EmptyMedia>
						<TriangleAlert />
					</EmptyMedia>
					<EmptyTitle>An Error Has Occurred</EmptyTitle>
					<EmptyDescription>{error.message}</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	if (isFetching) {
		return (
			<div className="flex flex-row items-center justify-center gap-2">
				<Spinner /> Loading...
			</div>
		);
	}
}
