import type { ApiErrorCode, ApiErrorData } from "@foxfire/types";

export class ApiError extends Error {
	readonly status: number;
	readonly code: ApiErrorCode;
	readonly fields?: ApiErrorData["fields"];
	constructor(data: ApiErrorData, status: number) {
		super(data.message);
		this.name = "ApiError";
		this.status = status;
		this.code = data.code;
		this.fields = data.fields;
	}
}
