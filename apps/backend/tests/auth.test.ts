import { describe, it, expect, beforeEach, afterEach, mock } from "bun:test";
import auth, { test } from "./lib/auth";
import { type User } from "better-auth";

describe("Authentication Module", async () => {
  let mockUsr: {
    header: Headers | undefined;
    user: User | undefined;
  } = {
    header: undefined,
    user: undefined,
  };

  beforeEach(async () => {
    const user = test.createUser({
      username: "john_doe",
      name: "John Doe",
      email: "john.doe@example.com",
    });
    mockUsr.user = await test.saveUser(user);
    mockUsr.header = await test.getAuthHeaders({ userId: user.id });
  });
  afterEach(async () => {
    await test.deleteUser(mockUsr.user!.id);
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
      headers: mockUsr.header,
      body: {
        username: "john_doe_upd",
      },
    });
    expect(result.status).toBe(true);
  });
  it("Deletes an User", async () => {
    const result = await auth.api.deleteUser({
      headers: mockUsr.header,
      body: {},
    });
    expect(result.success).toBe(true);
  });
});
