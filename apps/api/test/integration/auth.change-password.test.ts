import { describe, it, expect } from "vitest";
import { app } from "../helpers/build-app";
import { signupAndLogin, authHeader } from "../helpers/auth";

describe("change password", () => {
  it("rejects an incorrect current password", async () => {
    const token = await signupAndLogin("customer-pw1@test.com");

    const res = await app.inject({
      method: "PATCH",
      url: "/api/auth/password",
      headers: authHeader(token),
      payload: {
        currentPassword: "wrong-password",
        newPassword: "newpassword123",
      },
    });

    expect(res.statusCode).toBe(400);
    expect(res.json().error).toMatch(/incorrect/i);
  });

  it("accepts a correct current password and updates it", async () => {
    const token = await signupAndLogin("customer-pw2@test.com");

    const res = await app.inject({
      method: "PATCH",
      url: "/api/auth/password",
      headers: authHeader(token),
      payload: {
        currentPassword: "password123",
        newPassword: "newpassword123",
      },
    });

    expect(res.statusCode).toBe(200);
  });
});
