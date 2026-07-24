import { HomeIcon, KeyIcon, LogOut, Mail, UserIcon } from "lucide-react";
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
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Navbar() {
	const nav = useNavigate();
	const { data: session } = authClient.useSession();

	const [loginDialog, setLoginDialogState] = useState<boolean>(false);

	return (
		<nav>
			<span />
			<span>
				<Button
					variant="ghost"
					size="icon"
					className="h-full w-auto aspect-square group"
					onClick={() => nav("/")}
				>
					<HomeIcon className="size-7.5 group-active:scale-95 group-hover:text-primary transition-all" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className="h-full w-auto aspect-square group"
					onClick={() => nav("/posts")}
				>
					<Mail className="size-7.5 group-active:scale-95 group-hover:text-primary transition-all" />
				</Button>
			</span>
			<span>
				<DropdownMenu>
					{!session?.session && (
						<Dialog
							onOpenChange={() => setLoginDialogState((prev) => !prev)}
							open={loginDialog}
						>
							<DialogTrigger
								render={
									<Button
										variant="ghost"
										size="icon"
										className="h-full w-auto aspect-square group"
										onClick={() => nav("/")}
									>
										<KeyIcon className="size-7.5 group-active:scale-95 group-hover:text-primary transition-all" />
									</Button>
								}
							/>
							<LoginDialog onSuccess={() => setLoginDialogState(false)} />
						</Dialog>
					)}
					{session?.session && (
						<DropdownMenuTrigger
							render={
								<Button
									variant="ghost"
									size="icon"
									className="h-full w-auto aspect-square group"
									onClick={() => nav("/")}
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
					)}
					<DropdownMenuContent>
						<DropdownMenuItem
							variant="destructive"
							onClick={() => authClient.signOut()}
						>
							<LogOut />
							Logout
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</span>
		</nav>
	);
}
