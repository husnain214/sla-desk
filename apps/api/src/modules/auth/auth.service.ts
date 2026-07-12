import type { SignupPayload, LoginPayload } from "./auth.types";

import { eq } from "drizzle-orm";

import { db } from "../../db";
import { users } from "../../db/schemas/users.schema";
import { comparePassword, hashPassword } from "../../shared/utils/auth";
import { AppError } from "../../shared/errors/app-error";

export async function signupUser(payload: SignupPayload) {
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, payload.email))
    .limit(1);

  if (existingUser) {
    throw new AppError("An account with this email already exists");
  }

  const hashedPassword = await hashPassword(payload.password);

  const [user] = await db
    .insert(users)
    .values({
      name: payload.name,
      email: payload.email,
      passwordHash: hashedPassword,
    })
    .returning();

  const { passwordHash, ...savedUser } = user;

  return savedUser;
}

export async function loginUser(payload: LoginPayload) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, payload.email))
    .limit(1);

  if (!user) {
    throw new AppError("Invalid credentials");
  }

  const passwordMatches = await comparePassword(
    payload.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw new AppError("Invalid credentials");
  }

  const { passwordHash, ...loginUser } = user;

  return loginUser;
}
