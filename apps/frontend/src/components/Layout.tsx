import { Outlet } from "react-router";
import { authClient } from "@/lib/auth";
import { Navbar } from "./Navbar";
import { SetupScreen } from "./profile/Setup";
import { Toaster } from "./ui/toast";

export function Layout() {
	const { data } = authClient.useSession();
	return (
		<>
			<Navbar />
			<main>
				{data?.user &&
					(!data?.user.displayUsername || !data?.user.username) && (
						<SetupScreen
							data={{
								displayUsername: data?.user.displayUsername ?? "",
								username: data?.user.username ?? "",
							}}
						/>
					)}
				<Outlet />
			</main>
			<Toaster />
		</>
	);
}
