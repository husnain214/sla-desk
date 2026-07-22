"use server";

import { cookies } from "next/headers";
import axios from "axios";
import { LoginPayload } from "@myapp/shared";

export async function loginServerAction(values: LoginPayload) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
      values,
    );

    const setCookieHeader = response.headers["set-cookie"];

    if (setCookieHeader && setCookieHeader.length > 0) {
      const cookieStore = await cookies();

      const tokenValue =
        response.data.token || setCookieHeader[0].split(";")[0].split("=")[1];

      cookieStore.set({
        name: "token",
        value: tokenValue,
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
      });
    }

    return { success: true };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error || error.message || "Login failed";
    return { success: false, error: errorMessage };
  }
}
