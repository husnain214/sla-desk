import { describe, it, expect } from "vitest";
import { app } from "../helpers/build-app";
import { signupAndLogin, login, authHeader } from "../helpers/auth";

describe("teams RBAC", () => {
  it("non-admin cannot create a team", async () => {
    const customerToken = await signupAndLogin("customer-team1@test.com");

    const res = await app.inject({
      method: "POST",
      url: "/api/teams",
      headers: authHeader(customerToken),
      payload: { name: "Billing" },
    });

    expect(res.statusCode).toBe(403);
  });

  it("non-admin cannot delete a team", async () => {
    const adminToken = await login("admin@test.com");
    const createRes = await app.inject({
      method: "POST",
      url: "/api/teams",
      headers: authHeader(adminToken),
      payload: { name: "Support" },
    });
    const team = createRes.json();

    const agentToken = await login("agent@test.com");
    const deleteRes = await app.inject({
      method: "DELETE",
      url: `/api/teams/${team.id}`,
      headers: authHeader(agentToken),
    });

    expect(deleteRes.statusCode).toBe(403);
  });

  it("admin can create a team and assign an agent to it", async () => {
    const adminToken = await login("admin@test.com");

    const teamRes = await app.inject({
      method: "POST",
      url: "/api/teams",
      headers: authHeader(adminToken),
      payload: { name: "Infra" },
    });
    const team = teamRes.json();

    const meRes = await app.inject({
      method: "GET",
      url: "/api/auth/me",
      headers: authHeader(await login("agent@test.com")),
    });
    const agentId = meRes.json().id;

    const assignRes = await app.inject({
      method: "PATCH",
      url: `/api/users/${agentId}/team`,
      headers: authHeader(adminToken),
      payload: { teamId: team.id },
    });

    expect(assignRes.statusCode).toBe(200);
    expect(assignRes.json().teamId).toBe(team.id);
  });
});
