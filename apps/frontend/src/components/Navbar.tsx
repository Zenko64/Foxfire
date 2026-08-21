import { KeyIcon, LogOut, Mail, User, UserIcon } from "lucide-react";
import "@/assets/css/navbar.css";
import { useState } from "react";
import { useNavigate } from "react-router";
import { authClient } from "@/lib/auth";
import { LoginDialog } from "./login/Dialog";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";

export function Navbar() {
	const nav = useNavigate();
	const { data: session } = authClient.useSession();

	const [loginDialog, setLoginDialogState] = useState<boolean>(false);

	return (
		<nav>
			<span />
			<span>
				<Separator orientation="vertical" />
				<Button
					variant="ghost"
					size="icon"
					className="h-full w-auto aspect-square group"
					onClick={() => nav("/posts")}
				>
					<Mail className="size-7.5 group-active:scale-95 group-hover:text-primary transition-all" />
				</Button>
				<Separator orientation="vertical" />
			</span>
			<span>
				<Separator orientation="vertical" />
				{!session?.session && (
					<Dialog onOpenChange={setLoginDialogState} open={loginDialog}>
						<DialogTrigger
							render={
								<Button
									variant="ghost"
									size="icon"
									className="h-full w-auto aspect-square group"
								>
									<KeyIcon className="size-7.5 group-active:scale-95 group-hover:text-primary transition-all" />
								</Button>
							}
						/>
						<LoginDialog onSuccess={() => setLoginDialogState(false)} />
					</Dialog>
				)}
				{session?.session && (
					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button
									variant="ghost"
									size="icon"
									className="h-full w-auto aspect-square group"
								>
									{session.user.image ? (
										<img
											src={session.user.image}
											aria-label="Profile picture"
										/>
									) : (
										<UserIcon className="size-7.5 group-active:scale-95 group-hover:text-primary transition-all" />
									)}
								</Button>
							}
						/>
						<DropdownMenuContent align="end" sideOffset={4} alignOffset={3}>
							<DropdownMenuGroup>
								<DropdownMenuItem onClick={() => nav("/user", {})}>
									<User />
									Profile
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuGroup>
								<DropdownMenuItem
									variant="destructive"
									onClick={() => authClient.signOut()}
								>
									<LogOut />
									Logout
								</DropdownMenuItem>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</span>
		</nav>
	);
}
