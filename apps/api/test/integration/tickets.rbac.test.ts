import { describe, it, expect, beforeAll } from "vitest";
import { app } from "../helpers/build-app";
import { login, signup } from "../helpers/auth";

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
      url: "/tickets",
      headers: { authorization: `Bearer ${tokenA}` },
      payload: { title: "A's ticket", priority: "low" },
    });
    const ticket = await createRes.json();

    const viewRes = await app.inject({
      method: "GET",
      url: `/tickets/${ticket.id}`,
      headers: { authorization: `Bearer ${tokenB}` },
    });

    expect(viewRes.statusCode).toBe(403);
  });
});
