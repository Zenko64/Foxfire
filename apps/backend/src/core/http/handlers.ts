/**
 * @file core/http/handlers.ts
 * @name handlers
 * @module core/http/handlers
 * @description This file provides handlers that are required (but not necessarily essential) for correct function of the http server, such as error handlers.
 */

import type { ApiErrorData } from "@foxfire/types";
import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { AppError } from "../../lib/errors";
import logger from "../logger";

export function errorHandler(err: unknown, c: Context): Response {
	if (err instanceof AppError) {
		logger.log("error", `${err.name} - ${err.message}`); // TODO: Add loglevel to errs
		return c.json<ApiErrorData>(
			{ code: err.code, message: err.message, fields: err.fields },
			err.http.status as ContentfulStatusCode,
		);
	}
	logger.error(
		`Uncaught Error - ${err instanceof Error ? (err.stack ?? err.message) : String(err)}`,
	);
	return c.json<ApiErrorData>(
		{ code: "INTERNAL_ERROR", message: "An unknown error has occurred." },
		500,
	);
}
