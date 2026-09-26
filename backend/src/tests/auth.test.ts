import { describe, expect, it } from "bun:test";
import { getAuthToken } from "./utils/auth";
import { api } from "./utils/testApp";

describe("Auth API", () => {
  it("Send access-token with correct credentials", async () => {
    const token = await getAuthToken();
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(10);
  });

  it("Send 401 for wrong credentials", async () => {
    const { status, json } = await api("POST", "/auth/login", {
      body: {
        username: process.env.TEST_USERNAME ?? "",
        password: "wrong-password",
      },
    });

    expect(status).toBe(401);
    expect(json?.status).toBe("error");
  });

  it("Send error (400) with invalid request body", async () => {
    const { status } = await api("POST", "/auth/login", {
      body: { username: 123 },
    });

    expect(status).toBeGreaterThanOrEqual(400);
  });
});
