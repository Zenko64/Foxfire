import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { AppError } from "../../lib/errors";
import logger from "../logger";

export function errorHandler(err: unknown, c: Context): Response {
	if (err instanceof AppError) {
		logger.log("error", `${err.name} - ${err.message}`); // TODO: Add loglevel to errs
		return c.json(
			{ error: err.message },
			err.http.status as ContentfulStatusCode,
		);
	}
	logger.error(
		`Uncaught Error - ${err instanceof Error ? (err.stack ?? err.message) : String(err)}`,
	);
	return c.json({ error: "An unknown error has occurred." }, 500);
}
