import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z, { email, string } from "zod";
import { authClient } from "@/lib/auth";
import { Button } from "../ui/button";
import { Field, FieldError } from "../ui/field";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";
import { Input } from "./ui";

const formSchema = z.object({
	email: email("Please enter a valid Email.").min(1, "Please enter an Email."),
	password: string()
		.min(1, "Please enter a password.")
		.min(8, "Your password must be at least 8 Characters long."),
	name: string().min(1, "Please enter your name."),
	username: string()
		.min(3, "Your username must be at least 3 Characters long.")
		.max(30, "Your username must be at most 30 Characters long.")
		.regex(
			/^[a-zA-Z0-9_.]+$/,
			"Your username can only contain letters, numbers, underscores, and periods.",
		),
});

type FormValues = z.infer<typeof formSchema>;

export function Register({ onSuccess }: { onSuccess?: () => void }) {
	const [step, setStep] = useState(0);
	const [isPending, setPending] = useState<boolean>(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		mode: "onTouched",
		defaultValues: { email: "", password: "", name: "", username: "" },
	});

	async function onSubmit(e: React.SubmitEvent) {
		e.preventDefault();
		if (step === 0) {
			if (await form.trigger("email")) setStep(1);
			return;
		} else if (step === 1) {
			if (await form.trigger("password")) setStep(2);
			return;
		}

		if (!(await form.trigger(["name", "username", "email", "password"])))
			return;

		setPending(true);
		const { error } = await authClient.signUp.email(form.getValues());
		setPending(false);
		if (error) {
			switch (error.code) {
				case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
					form.setError("email", { message: "This Account Already Exists." });
					setStep(0);
					break;
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
		}
		onSuccess?.();
	}

	const Email = () => (
		<Controller
			name="email"
			control={form.control}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<span className="flex flex-row items-stretch">
						<Input
							{...field}
							id={field.name}
							type="email"
							placeholder="Email"
							isInvalid={fieldState.invalid}
						/>
						<Button type="submit" size="icon" className="border-0 ring-inset">
							<ArrowRight />
						</Button>
					</span>
					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	);

	const Password = () => (
		<Controller
			name="password"
			control={form.control}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<span className="flex flex-row items-stretch">
						<Input
							{...field}
							id={field.name}
							type="password"
							placeholder="Password"
							isInvalid={fieldState.invalid}
						/>
						<Button type="submit" size="icon" className="border-0 ring-inset">
							<ArrowRight />
						</Button>
					</span>
					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	);

	const Profile = () => (
		<div className="flex flex-col gap-2">
			<Controller
				name="name"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<Input
							{...field}
							id={field.name}
							type="text"
							placeholder="Full Name"
							isInvalid={fieldState.invalid}
						/>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>
			<Controller
				name="username"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<span className="flex flex-row items-stretch">
							<Input
								{...field}
								id={field.name}
								type="text"
								placeholder="Username"
								isInvalid={fieldState.invalid}
							/>
							<Button
								type="submit"
								size="icon"
								className="border-0 ring-inset"
								disabled={isPending}
							>
								{isPending ? <Spinner /> : <Send />}
							</Button>
						</span>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>
		</div>
	);

	return (
		<form noValidate onSubmit={onSubmit}>
			{step > 0 && (
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					className="absolute top-2 left-2"
					onClick={() => setStep((prev) => prev - 1)}
				>
					<ArrowLeft />
				</Button>
			)}

			{step === 0 && <Email />}
			{step === 1 && <Password />}
			{step === 2 && <Profile />}
		</form>
	);
}
