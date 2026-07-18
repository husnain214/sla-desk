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
