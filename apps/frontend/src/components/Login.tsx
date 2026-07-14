import { ArrowRight, GalleryVerticalEnd } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm() {
	const [action, setAction] = useState<"register" | "auth">("auth");
	const [stage, setStage] = useState<"email" | "password">("email");

	useEffect(() => {
		setStage("email");
	}, [action]);

	return (
		<form>
			<FieldGroup className={"flex flex-col gap-6"}>
				<div className="flex flex-col items-center gap-2 text-center">
					<div className="flex size-8 items-center justify-center rounded-md">
						<GalleryVerticalEnd className="size-6" />
					</div>
					<h1 className="text-xl font-bold">Welcome to Foxfire.</h1>
					{action === "auth" && (
						<FieldDescription>
							Don't have an account yet?{" "}
							<Button
								variant="link"
								onClick={() => setAction("register")}
								className={"ml-0 p-0 border-0"}
							>
								Register.
							</Button>
						</FieldDescription>
					)}
					{action === "register" && (
						<FieldDescription>
							Already have an account?{" "}
							<Button
								variant="link"
								onClick={() => setAction("auth")}
								className={"ml-0 p-0 border-0"}
							>
								Sign In.
							</Button>
						</FieldDescription>
					)}
				</div>
				<Field>
					{stage === "email" && (
						<>
							<FieldLabel htmlFor="email">Email</FieldLabel>
							<span className="flex flex-row items-center justify-around">
								<Input
									id="email"
									type="email"
									placeholder="user@example.com"
									required
								/>
								<Button
									size="icon"
									variant={"outline"}
									onClick={() => setStage("password")}
								>
									<ArrowRight />
								</Button>
							</span>
						</>
					)}
					{stage === "password" && (
						<>
							<FieldLabel htmlFor="password">Password</FieldLabel>
							<Input
								id="password"
								type="password"
								placeholder="Password"
								required
							/>
							{action === "auth" && <Button type="submit">Login</Button>}
							{action === "register" && <Button type="submit">Sign Up</Button>}
						</>
					)}
				</Field>
				<FieldSeparator>Or</FieldSeparator>
				<Field className="grid gap-4 sm:grid-cols-3">
					<Button variant="outline" type="button">
						Github
					</Button>
					<Button variant="outline" type="button">
						Google
					</Button>
					<Button variant="outline" type="button">
						Discord
					</Button>
				</Field>
			</FieldGroup>
		</form>
	);
}
