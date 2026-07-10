import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { nanoid as mkNanoid } from "nanoid";
import * as handler from "../src/posts/handlers";
import { test } from "./lib/auth";
import type { MockUser } from "./lib/types";

describe("Posting Module", () => {
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

	it("Creates a Post", async () => {
		const nanoid = mkNanoid();
		const post = await handler.createPost({
			authorId: mockUser.user!.id,
			text: "Hello, World.",
			nanoid,
		});

		expect(post!.nanoid).toBe(nanoid);
	});
	it("Updates a Post", async () => {
		const nanoid = mkNanoid();
		const post = await handler.createPost({
			authorId: mockUser.user!.id,
			text: "Hello, World.",
			nanoid,
		});
		const updatedPost = await handler.updatePost(
			{ text: "Goodbye, World." },
			{ nanoid: post!.nanoid },
		);

		expect(post!.text === updatedPost!.text).toBeFalse();
	});

	it("Deletes a Post", async () => {
		const nanoid = mkNanoid();
		const post = await handler.createPost({
			authorId: mockUser.user!.id,
			text: "Hello, World.",
			nanoid,
		});
		await handler.deletePost({ nanoid: post!.nanoid });

		const result = await handler.getPost({ nanoid: post!.nanoid });
		expect(result).toBeUndefined();
	});
});
