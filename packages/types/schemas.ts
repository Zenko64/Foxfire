import z from "zod";

const privacy = z.enum(
	["public", "private"],
	"The post's privacy level is missing.",
);

export const postSchema = z.object({
	text: z.string().min(1, "The post should not be empty."),
	pinned: z.boolean().default(false),
	privacy: privacy,
});
