import crypto from "node:crypto";

import { JwtPayload } from "../auth/auth.types";
import { AcceptInvitePayload, CreateInvitePayload } from "./invites.type";

import * as inviteRepository from "./invites.repository";
import * as userRepository from "../users/users.repository";

import { AppError } from "../../shared/errors/app-error";
import { hashPassword } from "../../shared/utils/auth";

const INVITE_EXPIRY_HOURS = 48;

export async function createInvite(
  payload: CreateInvitePayload,
  requestingUser: JwtPayload,
) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + INVITE_EXPIRY_HOURS * 60 * 60 * 1000);

  return inviteRepository.createInvite({
    email: payload.email,
    role: payload.role,
    token,
    invitedById: requestingUser.userId,
    teamId: payload.teamId,
    expiresAt,
  });
}

export async function acceptInvite(payload: AcceptInvitePayload) {
  const invite = await inviteRepository.findInviteByToken(payload.token);

  if (!invite) {
    throw new AppError("Invalid invite token", 400);
  }

  if (invite.usedAt) {
    throw new AppError("This invite has already been used", 400);
  }

  if (invite.expiresAt < new Date()) {
    throw new AppError("This invite has expired", 400);
  }

  const passwordHash = await hashPassword(payload.password);

  const user = await userRepository.createUser({
    name: payload.name,
    email: invite.email,
    passwordHash,
    role: invite.role,
    teamId: invite.teamId,
  });

  await inviteRepository.markInviteUsed(invite.id);

  return user;
}
