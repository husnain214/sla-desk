import { AppError } from "../../shared/errors/app-error";
import { JwtPayload } from "../auth/auth.types";
import * as userRepository from "./users.repository";

export async function assignUserToTeam(
  userId: string,
  teamId: string | null,
  requestingUser: JwtPayload,
) {
  if (requestingUser.role !== "admin") {
    throw new AppError("Only admins can assign users to teams", 403);
  }

  const user = await userRepository.findUserById(userId);
  if (!user) throw new AppError("User not found", 404);

  return userRepository.updateUserTeam(userId, teamId);
}
