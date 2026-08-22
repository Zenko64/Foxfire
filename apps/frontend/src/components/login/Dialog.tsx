import { GalleryVerticalEnd, HatGlasses } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldSeparator,
} from "@/components/ui/field";
import { authClient } from "@/lib/auth";
import { toast } from "../ui/toast";
import { Login } from "./Login";
import { Register } from "./Register";

// import DiscordLogo from "@/assets/svg/discord.svg?react";
// import GithubLogo from "@/assets/svg/github.svg?react";
// import GoogleLogo from "@/assets/svg/google.svg?react";

export function LoginDialog({ onSuccess }: { onSuccess: () => void }) {
	const [action, setAction] = useState<"register" | "auth">("auth");
	const onLoginSuccess = () => {
		toast.add({ type: "success", title: "Successfully logged in." });
		onSuccess();
	};
	const onRegisterSuccess = () => {
		toast.add({ type: "success", title: "Successfully signed up." });
		onSuccess();
	};

	const anonLogin = async () => {
		const { error } = await authClient.signIn.anonymous();
		if (error) {
			toast.add({
				type: "error",
				title: "Failed to login anonymously.",
				description: error.message,
			});
		}
	};

	return (
		<DialogContent>
			<FieldGroup className="flex flex-col gap-6">
				<div className="flex flex-col items-center gap-2 text-center">
					<DialogHeader className="items-center flex-col">
						<div className="flex flex-col items-center justify-center gap-2 text-center mt-4">
							<GalleryVerticalEnd className="size-6" />
							<DialogTitle className="text-xl font-bold">
								Welcome to Foxfire.
							</DialogTitle>
						</div>
					</DialogHeader>

					{action === "auth" && (
						<FieldDescription>
							Don't have an account yet?{" "}
							<Button
								type="button"
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
								type="button"
								variant="link"
								onClick={() => setAction("auth")}
								className={"ml-0 p-0 border-0"}
							>
								Sign In.
							</Button>
						</FieldDescription>
					)}
				</div>

				{action === "auth" && <Login onSuccess={onLoginSuccess} />}
				{action === "register" && <Register onSuccess={onRegisterSuccess} />}

				<FieldSeparator>Or</FieldSeparator>

				<Field className="grid gap-4 sm:grid-cols-1">
					<Button variant="outline" type="button" onClick={anonLogin}>
						<HatGlasses /> Anonymous
					</Button>
				</Field>
			</FieldGroup>
		</DialogContent>
	);
}

// function SocialProviders() {
// 	return (
// 		<Field className="grid gap-4 sm:grid-cols-3">
// 			<Button variant="outline" type="button">
// 				<GoogleLogo />
// 			</Button>
// 			<Button variant="outline" type="button">
// 				<GithubLogo />
// 			</Button>
// 			<Button variant="outline" type="button">
// 				<DiscordLogo />
// 			</Button>
// 		</Field>
// 	);
// }
