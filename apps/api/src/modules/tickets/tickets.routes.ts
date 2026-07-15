import type { AppInstance } from "../../types";

import { authenticate } from "../auth/auth.middleware";

import * as ticketService from "./tickets.service";
import * as ticketStatusHistoryService from "./ticket-status-history.service";

import {
  createTicketSchema,
  ticketIdSchema,
  ticketFiltersSchema,
  updateTicketStatusSchema,
  assignTicketSchema,
} from "./tickets.types";

export async function ticketRoutes(fastify: AppInstance) {
  fastify.post(
    "/",
    {
      schema: { body: createTicketSchema, tags: ["Tickets"] },
      preHandler: [authenticate],
    },
    async (request, reply) => {
      const ticket = await ticketService.createTicket(
        request.user.userId,
        request.body,
      );
      reply.code(201).send(ticket);
    },
  );

  fastify.get(
    "/",
    {
      schema: { querystring: ticketFiltersSchema, tags: ["Tickets"] },
      preHandler: [authenticate],
    },
    async (request, reply) => {
      const tickets = await ticketService.listTickets(
        request.user,
        request.query,
      );
      reply.send(tickets);
    },
  );

  fastify.get(
    "/:id",
    {
      schema: { params: ticketIdSchema, tags: ["Tickets"] },
      preHandler: [authenticate],
    },
    async (request, reply) => {
      const ticket = await ticketService.getTicketById(
        request.params.id,
        request.user,
      );
      reply.send(ticket);
    },
  );

  fastify.patch(
    "/:ticketId/status",
    {
      preHandler: [authenticate],
      schema: {
        params: ticketIdSchema,
        body: updateTicketStatusSchema,
        tags: ["Tickets"],
      },
    },
    async (request, reply) => {
      const ticket = await ticketStatusHistoryService.updateTicketStatus(
        request.params.id,
        request.body.status,
        request.user,
      );
      reply.send(ticket);
    },
  );

  fastify.patch(
    "/:id/assign",
    {
      preHandler: [authenticate],
      schema: { params: ticketIdSchema, body: assignTicketSchema },
    },
    async (request, reply) => {
      const ticket = await ticketService.assignTicket(
        request.params.id,
        request.body,
        request.user,
      );
      reply.send(ticket);
    },
  );
}
