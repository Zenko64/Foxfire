import { authSchema } from "@foxfire/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Send, UserIcon, X } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type z from "zod";
import { authClient } from "@/lib/auth";
import { Input } from "../login/ui";
import { Button } from "../ui/button";
import {
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
} from "../ui/dialog";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

const schema = authSchema.omit({ password: true, email: true });

export function ProfileEditDialog({
	onSuccess,
}: {
	onSuccess: (data: z.infer<typeof schema>) => void;
}) {
	const [isPending, setIsPending] = useState<boolean>(false);
	const { data } = authClient.useSession();
	const queryClient = useQueryClient();
	if (!data) return null;
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			displayUsername: data.user.displayUsername ?? "",
			username: data.user.username ?? "",
			name: data.user.name,
		},
	});

	const onSubmit = form.handleSubmit(async (values) => {
		const { error } = await authClient.updateUser({
			...values,
		});
		setIsPending(false);
		if (error) {
			switch (error.code) {
				case "USERNAME_IS_ALREADY_TAKEN":
					form.setError("username", {
						message: "This Username Is Already Taken.",
					});
					break;
				default:
					toast.add({
						type: "error",
						title: "An unknown error has occurred.",
						description: "Please try again.",
					});
			}
			return;
		}
		toast.add({
			type: "success",
			title: "Successfully Updated Profile.",
		});

		queryClient.invalidateQueries({ queryKey: ["user"] });

		onSuccess?.(values);
	});

	return (
		<DialogContent showCloseButton={false}>
			<DialogHeader>
				<h1>Update User Data</h1>
			</DialogHeader>
			<form className="flex flex-col gap-4" onSubmit={onSubmit}>
				<div className="flex flex-row gap-2">
					<div className="flex size-15 shrink-0 items-center justify-center overflow-hidden border">
						{data.user.image ? (
							<img alt="Avatar" src={data.user.image} className="size-15" />
						) : (
							<UserIcon className="p-4 size-32 aspect-square" />
						)}
					</div>
					<div className="flex flex-col gap-4">
						<Controller
							name="name"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid} className="gap-0.5">
									<FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
									<Input {...field} id={field.name} placeholder="Full Name" />
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<div className="flex flex-row gap-2">
							<Controller
								name="displayUsername"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid} className="gap-0.5">
										<FieldLabel htmlFor={field.name}>Display Name</FieldLabel>
										<Input
											{...field}
											id={field.name}
											placeholder="Display Name"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								name="username"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid} className="gap-0.5">
										<FieldLabel htmlFor={field.name}>Username</FieldLabel>
										<span className="relative items-center text-center flex justify-start">
											<p
												aria-hidden
												className="absolute left-1.5 select-none text-xs pointer-events-none text-muted-foreground"
											>
												@
											</p>
											<Input
												{...field}
												id={field.name}
												placeholder="Username"
												className="text-muted-foreground pl-4"
											/>
										</span>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</div>
					</div>
				</div>
				<DialogFooter className="flex flex-row items-center justify-end">
					<DialogClose
						render={
							<Button className="w-1/4.5" variant="secondary" type="button">
								<X /> Cancel
							</Button>
						}
					/>
					<Button className="w-1/4.5" type="submit">
						{isPending ? (
							<>
								<Spinner /> Updating...
							</>
						) : (
							<>
								<Send /> Send
							</>
						)}
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	);
}
