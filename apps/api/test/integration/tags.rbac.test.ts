import { describe, it, expect } from "vitest";
import { app } from "../helpers/build-app";
import {
  signupAndLogin,
  login,
  authHeader,
  createTicketAs,
} from "../helpers/auth";

describe("tags RBAC", () => {
  it("customer cannot attach a tag to their own ticket", async () => {
    const customerToken = await signupAndLogin("customer-tag1@test.com");
    const ticket = await createTicketAs(customerToken);
    const agentToken = await login("agent@test.com");

    const tagRes = await app.inject({
      method: "POST",
      url: "/api/tags",
      headers: authHeader(agentToken),
      payload: { name: "urgent-hardware" },
    });
    const tag = tagRes.json();

    const attachRes = await app.inject({
      method: "POST",
      url: `/api/tickets/${ticket.id}/tags/${tag.id}`,
      headers: authHeader(customerToken),
    });

    expect(attachRes.statusCode).toBe(403);
  });

  it("agent can attach and detach a tag from a ticket", async () => {
    const customerToken = await signupAndLogin("customer-tag2@test.com");
    const ticket = await createTicketAs(customerToken);
    const agentToken = await login("agent@test.com");

    const tagRes = await app.inject({
      method: "POST",
      url: "/api/tags",
      headers: authHeader(agentToken),
      payload: { name: "billing" },
    });
    const tag = tagRes.json();

    const attachRes = await app.inject({
      method: "POST",
      url: `/api/tickets/${ticket.id}/tags/${tag.id}`,
      headers: authHeader(agentToken),
    });
    expect(attachRes.statusCode).toBe(204);

    const detachRes = await app.inject({
      method: "DELETE",
      url: `/api/tickets/${ticket.id}/tags/${tag.id}`,
      headers: authHeader(agentToken),
    });
    expect(detachRes.statusCode).toBe(204);
  });
});
