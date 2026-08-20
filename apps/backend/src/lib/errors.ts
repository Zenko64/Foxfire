export abstract class AppError extends Error {
	abstract override name: string;
	abstract readonly http: {
		status: number;
	};
}

export class NotFoundError extends AppError {
	override name: string = "NotFoundError";
	readonly http = {
		status: 404,
	};
	constructor(message?: string) {
		super(message ?? "The requested resource was not found.");
	}
}

export class BadRequestError extends AppError {
	override name: string = "BadRequestError";
	readonly http = {
		status: 400,
	};
	constructor(message?: string) {
		super(message ?? "The request payload is malformed.");
	}
}

export class ForbiddenError extends AppError {
	override name: string = "ForbiddenError";
	readonly http = {
		status: 403,
	};
	constructor(message?: string) {
		super(
			message ?? "You don't have permission to access the requested resource.",
		);
	}
}

export class UnauthorizedError extends AppError {
	override name: string = "UnauthorizedError";
	readonly http = {
		status: 401,
	};
	constructor(message?: string) {
		super(message ?? "You are unauthorized to access the requested resource.");
	}
}

export class InternalError extends AppError {
	override name: string = "InternalError";
	readonly http = {
		status: 500,
	};
	constructor(message?: string) {
		super(message ?? "An unknown error has occurred.");
	}
}
