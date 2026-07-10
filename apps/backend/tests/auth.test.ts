import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import auth, { test } from "./lib/auth";
import type { MockUser } from "./lib/types";

describe("Authentication Module", async () => {
	const mockUser: MockUser = {
		header: undefined,
		user: undefined,
	};

	beforeEach(async () => {
		const user = test.createUser({
			username: "john_doe",
			name: "John Doe",
			email: "john.doe@example.com",
		});
		mockUser.user = await test.saveUser(user);
		mockUser.header = await test.getAuthHeaders({ userId: user.id });
	});
	afterEach(async () => {
		await test.deleteUser(mockUser.user!.id);
	});
	it("Creates an User", async () => {
		const result = await auth.api.signUpEmail({
			body: {
				username: "jane_doe",
				name: "Jane Doe",
				email: "jane.doe@example.com",
				password: "@JaneDoe12341234",
			},
		});
		expect(result.user.email).toBe("jane.doe@example.com");
	});
	it("Updates an User", async () => {
		const result = await auth.api.updateUser({
			headers: mockUser.header,
			body: {
				username: "john_doe_upd",
			},
		});
		expect(result.status).toBe(true);
	});
	it("Deletes an User", async () => {
		const result = await auth.api.deleteUser({
			headers: mockUser.header,
			body: {},
		});
		expect(result.success).toBe(true);
	});
});
