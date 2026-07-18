import { api } from "@/lib/axios";
import { SignupPayload } from "@myapp/shared";

export async function signup(signupPayload: SignupPayload) {
  const response = await api.post("signup", signupPayload);
  return response.data;
}
