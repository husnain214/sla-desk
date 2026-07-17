import { describe, it, expect } from "vitest";
import { app } from "../helpers/build-app";
import { signupAndLogin, createTicketAs, login } from "../helpers/auth";

describe("ticket assignment RBAC", () => {
  it("agent can claim an unassigned ticket for themselves", async () => {
    const customerToken = await signupAndLogin("customer-g@test.com");
    const ticket = await createTicketAs(customerToken);
    const agentToken = await login("agent@test.com");

    // decode the agent's own userId from the login response or a /auth/me call
    const meRes = await app.inject({
      method: "GET",
      url: "/auth/me",
      headers: { authorization: `Bearer ${agentToken}` },
    });
    const agentId = meRes.json().userId;

    const res = await app.inject({
      method: "PATCH",
      url: `/tickets/${ticket.id}/assign`,
      headers: { authorization: `Bearer ${agentToken}` },
      payload: { assignedAgentId: agentId },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().assignedAgentId).toBe(agentId);
  });

  it("agent cannot assign a ticket to a different agent", async () => {
    const customerToken = await signupAndLogin("customer-h@test.com");
    const ticket = await createTicketAs(customerToken);
    const agentToken = await login("agent@test.com");

    const res = await app.inject({
      method: "PATCH",
      url: `/tickets/${ticket.id}/assign`,
      headers: { authorization: `Bearer ${agentToken}` },
      payload: { assignedAgentId: "00000000-0000-0000-0000-000000000000" }, // some other fake agent id
    });

    expect(res.statusCode).toBe(403);
  });
});
