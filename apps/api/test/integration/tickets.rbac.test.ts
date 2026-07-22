import { describe, it, expect, beforeAll } from "vitest";
import { app } from "../helpers/build-app";
import { authHeader, login, signup } from "../helpers/auth";

describe("ticket access RBAC", () => {
  beforeAll(async () => {
    await app.ready();
  });

  it("customer cannot view another customer's ticket", async () => {
    await signup("customer-a@test.com");
    const tokenA = await login("customer-a@test.com");

    await signup("customer-b@test.com");
    const tokenB = await login("customer-b@test.com");

    const createRes = await app.inject({
      method: "POST",
      url: "/api/tickets",
      headers: authHeader(tokenA),
      payload: { title: "A's ticket", priority: "low" },
    });
    const ticket = await createRes.json();

    const viewRes = await app.inject({
      method: "GET",
      url: `/api/tickets/${ticket.id}`,
      headers: authHeader(tokenB),
    });

    expect(viewRes.statusCode).toBe(403);
  });
});
