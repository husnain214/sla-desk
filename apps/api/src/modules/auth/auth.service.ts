import type { SignupPayload, LoginPayload } from "./auth.types";

import * as authRepository from "./auth.repository";

import { comparePassword, hashPassword } from "../../shared/utils/auth";
import { AppError } from "../../shared/errors/app-error";

export async function signupUser(payload: SignupPayload) {
  const existingUser = await authRepository.findUserByEmail(payload.email);

  if (existingUser) {
    throw new AppError("An account with this email already exists", 409);
  }

  const hashedPassword = await hashPassword(payload.password);

  const user = await authRepository.createUser({
    name: payload.name,
    email: payload.email,
    passwordHash: hashedPassword,
  });

  const { passwordHash, ...savedUser } = user;

  return savedUser;
}

export async function loginUser(payload: LoginPayload) {
  const user = await authRepository.findUserByEmail(payload.email);

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const passwordMatches = await comparePassword(
    payload.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw new AppError("Invalid credentials", 401);
  }

  const { passwordHash, ...loginUser } = user;

  return loginUser;
}
