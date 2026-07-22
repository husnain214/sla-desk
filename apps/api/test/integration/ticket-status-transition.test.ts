import { describe, it, expect } from "vitest";
import { app } from "../helpers/build-app";
import {
  signupAndLogin,
  createTicketAs,
  login,
  authHeader,
} from "../helpers/auth";

describe("ticket status transitions", () => {
  it("rejects an invalid jump from open directly to closed", async () => {
    const customerToken = await signupAndLogin("customer-e@test.com");
    const ticket = await createTicketAs(customerToken);
    const agentToken = await login("agent@test.com");

    const res = await app.inject({
      method: "PATCH",
      url: `/api/tickets/${ticket.id}/status`,
      headers: authHeader(agentToken),
      payload: { status: "closed" },
    });

    expect(res.statusCode).toBe(400);
  });

  it("allows a valid transition and records history", async () => {
    const customerToken = await signupAndLogin("customer-f@test.com");
    const ticket = await createTicketAs(customerToken);
    const agentToken = await login("agent@test.com");

    const res = await app.inject({
      method: "PATCH",
      url: `/api/tickets/${ticket.id}/status`,
      headers: authHeader(agentToken),
      payload: { status: "pending" },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().status).toBe("pending");

    const historyRes = await app.inject({
      method: "GET",
      url: `/api/tickets/${ticket.id}/history`,
      headers: authHeader(agentToken),
    });

    expect(historyRes.json()).toHaveLength(1);
    expect(historyRes.json()[0].toStatus).toBe("pending");
  });
});
