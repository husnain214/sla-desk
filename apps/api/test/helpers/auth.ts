import { app } from "./build-app";

export async function signup(email: string, name = "Test User") {
  const res = await app.inject({
    method: "POST",
    url: "/api/auth/signup",
    payload: { name, email, password: "password123" },
  });
  return res.json();
}

export async function login(email: string) {
  const res = await app.inject({
    method: "POST",
    url: "/api/auth/login",
    payload: { email, password: "password123" },
  });
  const cookies = res.cookies;
  const tokenCookie = cookies.find((c) => c.name === "token");

  if (!tokenCookie) {
    throw new Error(
      `Login failed for ${email}: no token cookie returned. Response: ${res.body}`,
    );
  }

  return tokenCookie.value;
}

export async function signupAndLogin(email: string, name = "Test User") {
  await signup(email, name);
  return login(email);
}

export async function createTicketAs(token: string, overrides = {}) {
  const res = await app.inject({
    method: "POST",
    url: "/api/tickets",
    headers: authHeader(token),
    payload: { title: "Test ticket", priority: "low", ...overrides },
  });
  return res.json();
}

export function authHeader(token: string) {
  return { cookie: `token=${token}` };
}
