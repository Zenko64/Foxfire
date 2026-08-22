import z from "zod";

export const apiErrEnum = z.enum([
	"NOT_FOUND",
	"BAD_REQUEST",
	"FORBIDDEN",
	"UNAUTHORIZED",
	"INTERNAL_ERROR",
]);

export const errorSchema = z.object({
	code: apiErrEnum,
	message: z.string(),
	fields: z.record(z.string(), z.array(z.string())).optional(),
});

export type ApiErrorData = z.infer<typeof errorSchema>;
export type ApiErrorCode = z.infer<typeof apiErrEnum>;
