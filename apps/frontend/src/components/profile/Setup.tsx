import { authSchema } from "@foxfire/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type z from "zod";
import { authClient } from "@/lib/auth";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
} from "../ui/dialog";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

const schema = authSchema.pick({ username: true, displayUsername: true });

export function SetupScreen({ data }: { data?: z.infer<typeof schema> }) {
	const [isPending, setIsPending] = useState<boolean>(false);
	const queryClient = useQueryClient();
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			displayUsername: data?.displayUsername ?? "",
			username: data?.username ?? "",
		},
	});

	const onSubmit = form.handleSubmit(async (values) => {
		setIsPending(true);
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
			title: "Profile Setup Completed.",
		});

		queryClient.invalidateQueries({ queryKey: ["user"] });
	});
	return (
		<Dialog open onOpenChange={() => null}>
			<DialogContent showCloseButton={false}>
				<DialogHeader>
					<h1>User Setup</h1>
				</DialogHeader>
				<Separator />
				<form className="flex flex-col gap-4" onSubmit={onSubmit}>
					<Controller
						name="displayUsername"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid} className="gap-0.5">
								<FieldLabel htmlFor={field.name}>Display Name</FieldLabel>
								<Input
									{...field}
									id={field.name}
									aria-invalid={fieldState.invalid}
									disabled={isPending}
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
										aria-invalid={fieldState.invalid}
										disabled={isPending}
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
					<DialogFooter>
						<Button className="w-1/4.5" type="submit" disabled={isPending}>
							{isPending ? (
								<>
									<Spinner /> Updating...
								</>
							) : (
								<>
									<Send /> Update
								</>
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
