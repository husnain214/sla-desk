import { CreateTicketPayload, TicketFiltersPayload } from "./tickets.types";
import * as ticketRepository from "./tickets.repository";
import { calculateSlaDueAt } from "./sla";
import { JwtPayload } from "../auth/auth.types";
import { AppError } from "../../shared/errors/app-error";

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
  requestingUser: JwtPayload,
  ticketId: string,
) {
  const ticket = await ticketRepository.findTicketById(ticketId);

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
