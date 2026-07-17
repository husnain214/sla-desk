import { describe, it, expect } from "vitest";
import { app } from "../helpers/build-app";
import { signupAndLogin, createTicketAs, login } from "../helpers/auth";

describe("comment isInternal RBAC", () => {
  it("customer never sees internal comments, even if they try to send isInternal: true", async () => {
    const customerToken = await signupAndLogin("customer-c@test.com");
    const ticket = await createTicketAs(customerToken);

    // customer tries to force isInternal: true — should be silently overridden to false
    const commentRes = await app.inject({
      method: "POST",
      url: `/tickets/${ticket.id}/comments`,
      headers: { authorization: `Bearer ${customerToken}` },
      payload: { body: "Trying to sneak an internal note", isInternal: true },
    });

    expect(commentRes.json().isInternal).toBe(false);
  });

  it("agent's internal comment is excluded from customer's comment list", async () => {
    const customerToken = await signupAndLogin("customer-d@test.com");
    const ticket = await createTicketAs(customerToken);

    // seed an agent directly (bypassing invite flow for test simplicity)
    // assumes a seeded agent already exists — adjust to your actual seed strategy
    const agentToken = await login("agent@test.com");

    await app.inject({
      method: "POST",
      url: `/tickets/${ticket.id}/comments`,
      headers: { authorization: `Bearer ${agentToken}` },
      payload: { body: "Internal note for the team", isInternal: true },
    });

    const publicRes = await app.inject({
      method: "POST",
      url: `/tickets/${ticket.id}/comments`,
      headers: { authorization: `Bearer ${agentToken}` },
      payload: { body: "Public reply to customer", isInternal: false },
    });

    // customer views the ticket — should only see the public comment
    const ticketDetailRes = await app.inject({
      method: "GET",
      url: `/tickets/${ticket.id}`,
      headers: { authorization: `Bearer ${customerToken}` },
    });

    const comments = ticketDetailRes.json().comments;
    expect(comments).toHaveLength(1);
    expect(comments[0].body).toBe("Public reply to customer");
  });
});
