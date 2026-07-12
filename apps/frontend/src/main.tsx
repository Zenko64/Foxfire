import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./assets/css/main.css";
import { Layout } from "./components/layout";
import { Home } from "./pages/Home";
import { Posts } from "./pages/Posts";
import { ThemeProvider } from "./providers/ThemeProvider";

const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{
				path: "/",
				element: <Home />,
			},
			{
				path: "/posts",
				element: <Posts />,
			},
		],
	},
]);

const rootElement = document.getElementById("root");
if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<ThemeProvider storageKey="theme" defaultTheme="system">
				<RouterProvider router={router} />
			</ThemeProvider>
		</StrictMode>,
	);
} else {
	throw new Error("The Root Element Does Not Exist.");
}
