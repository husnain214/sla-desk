import { describe, it, expect } from "vitest";
import { app } from "../helpers/build-app";
import { signupAndLogin, login, authHeader } from "../helpers/auth";

describe("canned replies RBAC", () => {
  it("customer cannot create a canned reply", async () => {
    const customerToken = await signupAndLogin("customer-canned1@test.com");

    const res = await app.inject({
      method: "POST",
      url: "/api/canned-replies",
      headers: authHeader(customerToken),
      payload: {
        title: "Greeting",
        body: "Hi there, thanks for reaching out.",
      },
    });

    expect(res.statusCode).toBe(403);
  });

  it("agent can create a canned reply and it appears in the list", async () => {
    const agentToken = await login("agent@test.com");

    const createRes = await app.inject({
      method: "POST",
      url: "/api/canned-replies",
      headers: authHeader(agentToken),
      payload: {
        title: "Refund policy",
        body: "Our refund window is 30 days.",
      },
    });
    expect(createRes.statusCode).toBe(201);

    const listRes = await app.inject({
      method: "GET",
      url: "/api/canned-replies",
      headers: authHeader(agentToken),
    });
    expect(
      listRes
        .json()
        .some((r: { title: string }) => r.title === "Refund policy"),
    ).toBe(true);
  });
});
