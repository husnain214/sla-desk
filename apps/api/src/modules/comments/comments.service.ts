import type { CreateCommentPayload } from "./comments.types";
import { JwtPayload } from "../auth/auth.types";
import * as ticketService from "../tickets/tickets.service";
import * as commentRepository from "./comments.repository";

export async function createComment(
  ticketId: string,
  requestingUser: JwtPayload,
  payload: CreateCommentPayload,
) {
  await ticketService.getTicketById(ticketId, requestingUser);

  return commentRepository.createComment(ticketId, requestingUser.userId, {
    ...payload,
    ...(requestingUser.role === "customer" && { isInternal: false }),
  });
}

export async function getComments(
  ticketId: string,
  requestingUser: JwtPayload,
) {
  await ticketService.getTicketById(ticketId, requestingUser);
  const includeInternalComments = requestingUser.role !== "customer";

  return commentRepository.findCommentsForTicket(
    ticketId,
    includeInternalComments,
  );
}
