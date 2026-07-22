import { describe, it, expect } from "vitest";
import { app } from "../helpers/build-app";
import { authHeader, login, signupAndLogin } from "../helpers/auth";
import { eq } from "drizzle-orm";
import { users } from "../../src/db/schemas/users.schema";
import { invites } from "../../src/db/schemas/invites.schema";
import { db } from "../../src/db";
import crypto from "crypto";

describe("invite flow", () => {
  it("admin can create an invite, and the invited person can accept it as an agent", async () => {
    const adminToken = await login("admin@test.com");

    const inviteRes = await app.inject({
      method: "POST",
      url: "/api/invites",
      headers: authHeader(adminToken),
      payload: { email: "new-agent@test.com", role: "agent" },
    });
    const invite = inviteRes.json();

    const acceptRes = await app.inject({
      method: "POST",
      url: "/api/invites/accept",
      payload: {
        token: invite.token,
        name: "New Agent",
        password: "password123",
      },
    });

    expect(acceptRes.statusCode).toBe(201);
    expect(acceptRes.json().role).toBe("agent");
  });

  it("a non-admin cannot create an invite", async () => {
    const customerToken = await signupAndLogin("customer-i@test.com");

    const res = await app.inject({
      method: "POST",
      url: "/api/invites",
      headers: authHeader(customerToken),
      payload: { email: "attempted-invite@test.com", role: "agent" },
    });

    expect(res.statusCode).toBe(403);
  });

  it("an invite cannot be used twice", async () => {
    const adminToken = await login("admin@test.com");

    const inviteRes = await app.inject({
      method: "POST",
      url: "/api/invites",
      headers: authHeader(adminToken),
      payload: { email: "reused-invite@test.com", role: "agent" },
    });
    const invite = inviteRes.json();

    // first acceptance — should succeed
    const firstAccept = await app.inject({
      method: "POST",
      url: "/api/invites/accept",
      payload: {
        token: invite.token,
        name: "First Accept",
        password: "password123",
      },
    });
    expect(firstAccept.statusCode).toBe(201);

    // second acceptance with the same token — should be rejected
    const secondAccept = await app.inject({
      method: "POST",
      url: "/api/invites/accept",
      payload: {
        token: invite.token,
        name: "Second Accept Attempt",
        password: "password123",
      },
    });

    expect(secondAccept.statusCode).toBe(400);
    expect(secondAccept.json().error).toMatch(/already been used/i);
  });

  it("an expired invite is rejected", async () => {
    // fetch the seeded admin's id, since invitedById is a required FK
    const [admin] = await db
      .select()
      .from(users)
      .where(eq(users.email, "admin@test.com"));

    // insert an invite directly, backdating expiresAt into the past —
    // this bypasses createInvite() specifically to test the expiry check
    const [expiredInvite] = await db
      .insert(invites)
      .values({
        email: "too-late@test.com",
        role: "agent",
        token: crypto.randomBytes(32).toString("hex"),
        invitedById: admin.id,
        expiresAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour in the past
      })
      .returning();

    const acceptRes = await app.inject({
      method: "POST",
      url: "/api/invites/accept",
      payload: {
        token: expiredInvite.token,
        name: "Too Late",
        password: "password123",
      },
    });

    expect(acceptRes.statusCode).toBe(400);
    expect(acceptRes.json().error).toMatch(/expired/i);
  });
});
