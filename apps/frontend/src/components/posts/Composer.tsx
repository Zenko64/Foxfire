import type { postSchema } from "@foxfire/types";
import { Send, X } from "lucide-react";
import { useState } from "react";
import type z from "zod";
import { type Post, useCreatePost } from "@/hooks/posts/queries";
import { usePatchPost } from "../../hooks/posts/queries";
import { privacyLabels } from "../constants/Privacy";
import { Button } from "../ui/button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Spinner } from "../ui/spinner";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/toast";

export function Composer({
	onComplete,
	edit,
}: {
	onComplete: () => void;
	edit?: Post;
}) {
	const { status: createStatus, mutate: createMutate } = useCreatePost();
	const { status: patchStatus, mutate: patchMutate } = usePatchPost();

	const [text, setText] = useState<string>(edit?.text ?? "");
	const [privacy, setPrivacy] = useState<
		z.infer<typeof postSchema.shape.privacy>
	>(edit?.privacy ?? "public");

	const isPending = createStatus === "pending" || patchStatus === "pending";

	const onSubmit = () => {
		if (edit) {
			patchMutate(
				{ postData: { privacy, text }, postNanoid: edit.nanoid },
				{
					onSuccess: onComplete,
					onError: (err: unknown) =>
						toast.add({
							title: "Failed to update post.",
							description: err instanceof Error ? err.message : String(err),
							type: "error",
						}),
				},
			);
			return;
		}
		createMutate(
			{ pinned: false, privacy, text },
			{
				onSuccess: onComplete,
				onError: (err: unknown) =>
					toast.add({
						title: "Failed to create post.",
						description: err instanceof Error ? err.message : String(err),
						type: "error",
					}),
			},
		);
	};

	return (
		<div className="min-w-full w-full h-full min-h-40 bg-card border flex flex-col">
			<Textarea
				disabled={isPending}
				value={text}
				onChange={(e) => setText(e.target.value)}
				className="outline-0 bg-transparent! resize-none flex-1 min-h-0 field-sizing-fixed p-4"
				placeholder="Start typing..."
			/>
			<Separator />
			<div className="flex flex-row items-center justify-between gap-2 px-1 py-1 bg-transparent">
				<Select
					value={privacy}
					onValueChange={(e) => setPrivacy(e ?? "public")}
					items={privacyLabels}
					disabled={isPending}
				>
					<SelectTrigger>
						<SelectValue>
							{privacyLabels.map((i) => i.value === privacy && i.label)}
						</SelectValue>
					</SelectTrigger>
					<SelectContent
						align="start"
						side="bottom"
						sideOffset={0}
						alignOffset={1}
						alignItemWithTrigger={false}
						className="w-fit min-w-40"
					>
						<SelectGroup>
							{privacyLabels.map((i) => (
								<SelectItem
									key={i.value}
									value={i.value}
									className="flex flex-row gap-1"
								>
									{i.label}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>

				<span className="flex flex-row items-center justify-center gap-1">
					<Button
						type="button"
						variant="secondary"
						onClick={() => onComplete()}
						disabled={isPending}
					>
						<X />
						Cancel
					</Button>
					<Button
						onClick={() => onSubmit()}
						disabled={!text.trim() || isPending}
					>
						{isPending ? (
							<>
								<Spinner /> {edit ? "Saving" : "Posting"}
							</>
						) : (
							<>
								<Send />
								{edit ? "Save" : "Post"}
							</>
						)}
					</Button>
				</span>
			</div>
		</div>
	);
}
