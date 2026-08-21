import { Eye, EyeOff, Lock } from "lucide-react";

export const privacyLabels = [
	{
		label: (
			<>
				<Lock className="size-4" /> Private
			</>
		),
		value: "private",
	},
	{
		label: (
			<>
				<EyeOff className="size-4" /> Unlisted
			</>
		),
		value: "unlisted",
	},
	{
		label: (
			<>
				<Eye className="size-4" /> Public
			</>
		),
		value: "public",
	},
];
