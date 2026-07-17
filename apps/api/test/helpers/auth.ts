import { app } from "./build-app";

export async function signup(email: string, name = "Test User") {
  const res = await app.inject({
    method: "POST",
    url: "/auth/signup",
    payload: { name, email, password: "password123" },
  });
  return res.json();
}

export async function login(email: string) {
  const res = await app.inject({
    method: "POST",
    url: "/auth/login",
    payload: { email, password: "password123" },
  });
  return res.json().token;
}

export async function signupAndLogin(email: string, name = "Test User") {
  await signup(email, name);
  return login(email);
}

export async function createTicketAs(token: string, overrides = {}) {
  const res = await app.inject({
    method: "POST",
    url: "/tickets",
    headers: { authorization: `Bearer ${token}` },
    payload: { title: "Test ticket", priority: "low", ...overrides },
  });
  return res.json();
}
