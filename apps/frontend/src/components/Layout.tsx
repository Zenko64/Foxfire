import { Outlet } from "react-router";
import { Navbar } from "./Navbar";
import { Toaster } from "./ui/toast";

export function Layout() {
	return (
		<>
			<Navbar />
			<main>
				<Outlet />
			</main>
			<Toaster />
		</>
	);
}
