import { HomeIcon, Mail } from "lucide-react";
import "@/assets/css/navbar.css";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";

export function Navbar() {
	const nav = useNavigate();

	return (
		<nav>
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
		</nav>
	);
}
