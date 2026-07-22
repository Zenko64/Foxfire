import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Key } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z, { email, string } from "zod";
import { authClient } from "@/lib/auth";
import { Button } from "../ui/button";
import { Field, FieldError } from "../ui/field";
import { Input } from "./ui";

const formSchema = z.object({
	email: email("Please enter a valid Email.").min(1, "Please enter an Email."),
	password: string().min(1, "Please enter a password."),
});

export function Login({ onSuccess }: { onSuccess?: () => void }) {
	const [step, setStep] = useState<"email" | "password">("email");
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		mode: "onTouched",
		defaultValues: { email: "", password: "" },
	});

	async function onSubmit(e: React.SubmitEvent) {
		e.preventDefault();

		if (step === "email") {
			await form.trigger("email");
			setStep("password");
			return;
		}

		if (!(await form.trigger(["email", "password"]))) return;

		const { error } = await authClient.signIn.email(form.getValues());
		if (error?.code === "INVALID_EMAIL_OR_PASSWORD") {
			form.setError("email", {
				message: "The provided credentials are incorrect.",
			});
			form.setValue("password", "");
			setStep("email");
		}
		if (error) return;

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
							<Key />
						</Button>
					</span>
					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	);

	return (
		<form noValidate onSubmit={onSubmit}>
			{step === "password" && (
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					className="absolute top-2 left-2"
					onClick={() => setStep("email")}
				>
					<ArrowLeft />
				</Button>
			)}

			{step === "email" && <Email />}
			{step === "password" && <Password />}
		</form>
	);
}
