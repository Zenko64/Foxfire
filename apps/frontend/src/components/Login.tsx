import {
	ArrowLeft,
	ArrowRight,
	GalleryVerticalEnd,
	Key,
	Send,
} from "lucide-react";
import { useEffect, useState } from "react";
import DiscordLogo from "@/assets/svg/discord.svg?react";
import GithubLogo from "@/assets/svg/github.svg?react";
import GoogleLogo from "@/assets/svg/google.svg?react";
import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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
		<DialogContent>
			<form>
				<FieldGroup className="flex flex-col gap-6">
					<div className="flex flex-col items-center gap-2 text-center">
						<DialogHeader className="items-center flex-col">
							{stage === "password" && (
								<Button
									variant="ghost"
									size="icon-sm"
									className="absolute top-2 left-2"
									onClick={() => setStage("email")}
								>
									<ArrowLeft />
								</Button>
							)}
							<div className="flex flex-col items-center justify-center gap-2 text-center mt-4">
								<GalleryVerticalEnd className="size-6" />
								<DialogTitle className="text-xl font-bold">
									Welcome to Foxfire.
								</DialogTitle>
							</div>
						</DialogHeader>
						<DialogDescription render={<div />}>
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
						</DialogDescription>
					</div>
					<Field>
						{stage === "email" && (
							<>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<span className="flex flex-row items-stretch">
									<Input
										id="email"
										type="email"
										placeholder="user@example.com"
										required
										className="ring-inset"
									/>
									<Button
										size="icon"
										onClick={() => setStage("password")}
										className="border-0 ring-inset"
									>
										<ArrowRight />
									</Button>
								</span>
							</>
						)}
						{stage === "password" && (
							<>
								<FieldLabel htmlFor="password">Password</FieldLabel>

								<span className="flex flex-row items-stretch">
									<Input
										id="password"
										type="password"
										placeholder="Password"
										className="ring-inset"
										required
									/>
									{action === "auth" && (
										<Button
											type="submit"
											size="icon"
											className="border-0 ring-inset"
										>
											<Key />
										</Button>
									)}
									{action === "register" && (
										<Button
											type="submit"
											size="icon"
											className="border-0 ring-inset"
										>
											<Send />
										</Button>
									)}
								</span>
							</>
						)}
					</Field>
					<FieldSeparator>Or</FieldSeparator>
					<Field className="grid gap-4 sm:grid-cols-3">
						<Button variant="outline" type="button">
							<GoogleLogo />
						</Button>
						<Button variant="outline" type="button">
							<GithubLogo />
						</Button>
						<Button variant="outline" type="button">
							<DiscordLogo />
						</Button>
					</Field>
				</FieldGroup>
			</form>
		</DialogContent>
	);
}
