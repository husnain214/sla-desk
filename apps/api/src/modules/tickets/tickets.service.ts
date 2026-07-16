import {
  AssignTicketPayload,
  CreateTicketPayload,
  TicketFiltersPayload,
} from "./tickets.types";
import * as ticketRepository from "./tickets.repository";
import * as ticketService from "./tickets.service";
import { calculateSlaDueAt } from "./sla";
import { JwtPayload } from "../auth/auth.types";
import { AppError } from "../../shared/errors/app-error";
import { io } from "../../realtime/socket-server";

export async function createTicket(
  customerId: string,
  payload: CreateTicketPayload,
) {
  const slaDueAt = calculateSlaDueAt(payload.priority);
  const ticket = await ticketRepository.createTicket({
    ...payload,
    customerId,
    slaDueAt,
  });

  return ticket;
}

export async function getTicketById(
  ticketId: string,
  requestingUser: JwtPayload,
) {
  const includeInternalComments = requestingUser.role !== "customer";
  const ticket = await ticketRepository.findTicketById(
    ticketId,
    includeInternalComments,
  );

  if (!ticket) {
    throw new AppError("Ticket not found", 404);
  }

  if (
    requestingUser.role === "customer" &&
    ticket.customerId !== requestingUser.userId
  ) {
    throw new AppError("You are not allowed to view this ticket", 403);
  }

  return ticket;
}

export async function listTickets(
  requestingUser: JwtPayload,
  filters: TicketFiltersPayload,
) {
  if (requestingUser.role === "customer") {
    return ticketRepository.findTicketsForCustomer(requestingUser.userId);
  }

  return ticketRepository.findAllTickets(filters);
}

export async function assignTicket(
  ticketId: string,
  payload: AssignTicketPayload,
  requestingUser: JwtPayload,
) {
  if (requestingUser.role === "customer") {
    throw new AppError("Not allowed to assign tickets", 403);
  }

  const ticket = await ticketService.getTicketById(ticketId, requestingUser);

  if (requestingUser.role === "agent") {
    const isSelfClaim = payload.assignedAgentId === requestingUser.userId;
    const isUnassigned = ticket.assignedAgentId === null;

    if (!isSelfClaim || !isUnassigned) {
      throw new AppError(
        "Agents can only claim unassigned tickets for themselves",
        403,
      );
    }
  }

  const updatedTicket = await ticketRepository.updateAssignment(
    ticketId,
    payload,
  );

  io.to(`ticket:${ticketId}`).emit("ticket:assigned", updatedTicket);

  return updatedTicket;
}
