import type { CreateCommentPayload } from "./comments.types";
import { JwtPayload } from "../auth/auth.types";
import * as ticketService from "../tickets/tickets.service";
import * as commentRepository from "./comments.repository";
import { io } from "../../realtime/socket-server";

export async function createComment(
  ticketId: string,
  requestingUser: JwtPayload,
  payload: CreateCommentPayload,
) {
  await ticketService.getTicketById(ticketId, requestingUser);

  const comment = await commentRepository.createComment(
    ticketId,
    requestingUser.userId,
    {
      ...payload,
      ...(requestingUser.role === "customer" && { isInternal: false }),
    },
  );

  // NOTE: internal comments are broadcast to the same room as public ones.
  // The frontend is responsible for not rendering isInternal comments to
  // customer-role clients. This mirrors the REST endpoint's trust boundary
  // but does not enforce server-side filtering at the socket layer.

  io.to(`ticket:${ticketId}`).emit("comment:created", comment);

  return comment;
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
