export class NotFoundError extends Error {
	override name: string = "NotFoundError";
	readonly http = {
		status: 404,
	};
	constructor(message?: string) {
		super(message ?? "The requested resource was not found.");
	}
}

export class BadRequestError extends Error {
	override name: string = "BadRequestError";
	readonly http = {
		status: 400,
	};
	constructor(message?: string) {
		super(message ?? "The request payload is malformed.");
	}
}

export class ForbiddenError extends Error {
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

export class UnauthorizedError extends Error {
	override name: string = "UnauthorizedError";
	readonly http = {
		status: 401,
	};
	constructor(message?: string) {
		super(message ?? "You are unauthorized to access the requested resource.");
	}
}

export class InternalError extends Error {
	override name: string = "InternalError";
	readonly http = {
		status: 500,
	};
	constructor(message?: string) {
		super(message ?? "An unknown error has occurred.");
	}
}
