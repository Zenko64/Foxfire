import { HomeIcon, KeyIcon, Mail } from "lucide-react";
import "@/assets/css/navbar.css";
import { useNavigate } from "react-router";
import { LoginForm } from "./Login";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";

export function Navbar() {
	const nav = useNavigate();

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
				<Dialog>
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
					<LoginForm />
				</Dialog>
			</span>
		</nav>
	);
}
