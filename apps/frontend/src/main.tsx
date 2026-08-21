import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./assets/css/main.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "./components/Layout";
import { Posts } from "./pages/Posts";
import { Profile } from "./pages/Profile";
import { ThemeProvider } from "./providers/ThemeProvider";

const queryClient = new QueryClient();

const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{
				index: true,
				element: <Posts />,
			},
			{
				path: "/posts",
				index: true,
				element: <Posts />,
			},
			{
				path: "/user",
				element: <Profile />,
			},
			{
				path: "/user/:username",
				element: <Profile />,
			},
		],
	},
]);

const rootElement = document.getElementById("root");
if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<ThemeProvider storageKey="theme" defaultTheme="system">
				<QueryClientProvider client={queryClient}>
					<RouterProvider router={router} />
				</QueryClientProvider>
			</ThemeProvider>
		</StrictMode>,
	);
} else {
	throw new Error("The Root Element Does Not Exist.");
}
