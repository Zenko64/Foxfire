import { Home } from "lucide-react";
import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router";
import { Button } from "./ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";

export function ErrorBoundary() {
	const error = useRouteError();
	const title = isRouteErrorResponse(error)
		? `${error.status} ${error.statusText}`
		: error instanceof Error
			? error.name
			: "An unknown error has occurred.";

	const message = isRouteErrorResponse(error)
		? error.data
		: error instanceof Error
			? error.message
			: String(error);

	const nav = useNavigate();

	return (
		<div className="flex min-h-screen items-center justify-center">
			<Card className="w-full max-w-lg">
				<CardHeader>
					<CardTitle className="text-xl font-bold">{title}</CardTitle>
					<CardDescription>
						Something went wrong while rendering this page.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="max-h-64 overflow-auto wrap-break-word border border-border bg-muted p-4 font-mono text-muted-foreground">
						{message}
					</p>
				</CardContent>
				<CardFooter className="p-2 justify-end">
					<Button onClick={() => nav("/")}>
						<Home />
						Go Back
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
