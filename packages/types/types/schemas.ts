import z from "zod";

export const privacyEnum = z.enum(
	["public", "private", "unlisted"],
	"The post's privacy level is missing.",
);

export const postSchema = z.object({
	text: z
		.string()
		.min(1, "The post should not be empty.")
		.max(4000, "Your post can only contain up to 4000 characters.")
		.trim(),
	pinned: z.boolean(),
	privacy: privacyEnum,
});

export const authSchema = z.object({
	email: z
		.email("Please enter a valid Email.")
		.trim()
		.min(1, "Please enter an email."),
	password: z
		.string()
		.trim()
		.min(1, "Please enter a password.")
		.min(8, "Your password must be at least 8 characters long."),
	name: z.string().min(1, "Please enter your name.").trim(),
	username: z
		.string()
		.trim()
		.min(3, "Your username must be at least 3 characters long")
		.max(30, "Your username must be at most 30 characters long.")
		.regex(
			/^[a-zA-Z0-9_.]+$/,
			"Your username can only contain letters, numbers, underscores, and periods.",
		),
	displayUsername: z
		.string()
		.trim()
		.min(1, "Please enter a display name.")
		.max(30, "Your display name must be at most 30 characters long."),
});

export type PrivacyLevel = z.infer<typeof privacyEnum>;
