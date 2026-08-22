import { afterAll, mock } from "bun:test";
import testDb, { dbClient } from "./db";

mock.module("../../src/db", () => ({ default: testDb }));

afterAll(async () => {
	await dbClient.close();
});
