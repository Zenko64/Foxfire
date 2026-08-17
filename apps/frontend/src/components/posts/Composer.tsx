import { postSchema } from "@foxfire/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Send } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import type z from "zod";
import { useCreatePost } from "@/hooks/posts/queries";
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

const privacyLabels = [
	{
		label: (
			<>
				<Lock /> Private
			</>
		),
		value: "private",
	},
	{
		label: (
			<>
				<EyeOff /> Unlisted
			</>
		),
		value: "unlisted",
	},
	{
		label: (
			<>
				<Eye /> Public
			</>
		),
		value: "public",
	},
];

export function Composer({ onSuccess }: { onSuccess: () => void }) {
	const { status, error, mutate } = useCreatePost();
	const form = useForm<z.infer<typeof postSchema>>({
		resolver: zodResolver(postSchema),
		mode: "onSubmit",
		defaultValues: { privacy: "public", pinned: false, text: "" },
	});

	const onSubmit = (e: React.SubmitEvent) => {
		e.preventDefault();
		console.log("POST");
		mutate(form.getValues());

		if (status === "success") return onSuccess();
		else if (status === "error")
			toast.add({
				title: "Failed to create post.",
				description: error.message,
				type: "error",
			});
	};

	return (
		<form onSubmit={onSubmit}>
			<div className="min-w-full w-full h-full min-h-40 bg-card border flex flex-col">
				<Controller
					name="text"
					control={form.control}
					render={({ field, fieldState }) => (
						<Textarea
							{...field}
							aria-invalid={fieldState.invalid}
							className="outline-0 border-0 bg-transparent! resize-none flex-1 min-h-0 field-sizing-fixed"
							placeholder="Start typing..."
						/>
					)}
				/>
				<Separator />
				<div className="flex flex-row items-center justify-between gap-2 px-1 py-1 bg-transparent">
					<Controller
						name="privacy"
						control={form.control}
						render={({ field }) => (
							<Select
								{...field}
								name={field.name}
								value={field.value}
								onValueChange={field.onChange}
								items={privacyLabels}
							>
								<SelectTrigger>
									<SelectValue>
										{privacyLabels.map(
											(i) => i.value === field.value && i.label,
										)}
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
						)}
					/>
					<Button type="submit">
						{status === "pending" ? (
							<>
								<Spinner /> Posting
							</>
						) : (
							<>
								<Send />
								Post
							</>
						)}
					</Button>
				</div>
			</div>
		</form>
	);
}
