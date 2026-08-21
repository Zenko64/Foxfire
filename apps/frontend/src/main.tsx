import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./assets/css/main.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "./components/Layout";
import { PostsPage } from "./pages/Posts";
import { ProfilePage } from "./pages/Profile";
import { ThemeProvider } from "./providers/ThemeProvider";

const queryClient = new QueryClient();

const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{
				index: true,
				element: <PostsPage />,
			},
			{
				path: "/posts",
				element: <PostsPage />,
			},
			{
				path: "/user",
				element: <ProfilePage />,
			},
			{
				path: "/user/:username",
				element: <ProfilePage />,
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
