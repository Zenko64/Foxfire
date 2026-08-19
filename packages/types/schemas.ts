import z from "zod";

const privacy = z.enum(
	["public", "private", "unlisted"],
	"The post's privacy level is missing.",
);

export const postSchema = z.object({
	text: z.string().min(1, "The post should not be empty.").trim(),
	pinned: z.boolean(),
	privacy: privacy,
});

export const authSchema = z.object({
	email: z
		.email("Please enter a valid Email.")
		.min(1, "Please enter an email.")
		.trim(),
	password: z
		.string()
		.min(1, "Please enter a password.")
		.min(8, "Your passwsord must be at least 8 characters long.")
		.trim(),
	name: z.string().min(1, "Please enter your name.").trim(),
	username: z
		.string()
		.min(3, "Your username must be at least 3 characters long")
		.max(3, "Your username must be at most 30 characters long.")
		.regex(
			/^[a-zA-Z0-9_.]+$/,
			"Your username can only contain letters, numbers, underscores, and periods.",
		)
		.trim(),
	displayUsername: z
		.string()
		.min(1, "Please enter a profile name.")
		.max(30, "Your profile name must be at most 30 characters long."),
});
