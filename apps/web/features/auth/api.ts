import { api } from "@/lib/axios";
import { LoginPayload, SignupPayload } from "@myapp/shared";

export async function signup(signupPayload: SignupPayload) {
  const response = await api.post("auth/signup", signupPayload);
  return response.data;
}

export async function login(loginpayload: LoginPayload) {
  const response = await api.post("auth/login", loginpayload);
  return response.data;
}

export async function logout() {
  const response = await api.post("auth/logout");
  return response.data;
}

export async function getMe() {
  const response = await api.get("auth/me");
  return response.data;
}
