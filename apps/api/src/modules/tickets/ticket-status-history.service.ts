import { db } from "../../db";
import { JwtPayload } from "../auth/auth.types";
import { AppError } from "../../shared/errors/app-error";
import { canTransition, TicketStatus } from "./ticket-state-machine";

import * as ticketService from "./tickets.service";
import * as ticketRepository from "./tickets.repository";
import * as ticketStatusHistoryRepository from "./ticket-status-history.repository";
import { io } from "../../realtime/socket-server";

export async function updateTicketStatus(
  ticketId: string,
  newStatus: TicketStatus,
  requestingUser: JwtPayload,
) {
  const ticket = await ticketService.getTicketById(ticketId, requestingUser);

  if (!canTransition(ticket.status, newStatus)) {
    throw new AppError(
      `Cannot transition from ${ticket.status} to ${newStatus}`,
      400,
    );
  }

  const updatedTicket = await db.transaction(async (tx) => {
    const updated = await ticketRepository.updateStatus(
      ticketId,
      newStatus,
      tx,
    );

    await ticketStatusHistoryRepository.insertHistoryEntry(
      {
        ticketId,
        fromStatus: ticket.status,
        toStatus: newStatus,
        changedBy: requestingUser.userId,
      },
      tx,
    );

    return updated;
  });

  io.to(`ticket:${ticketId}`).emit("ticket:updated", updatedTicket);

  return updatedTicket;
}

export async function getTicketHistory(
  ticketId: string,
  requestingUser: JwtPayload,
) {
  await ticketService.getTicketById(ticketId, requestingUser);
  return ticketStatusHistoryRepository.findHistoryForTicket(ticketId);
}
