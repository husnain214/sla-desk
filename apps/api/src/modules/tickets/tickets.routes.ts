import type { AppInstance } from "../../types";

import { authenticate } from "../auth/auth.middleware";
import * as ticketService from "./tickets.service";
import {
  createTicketSchema,
  getTicketByIdSchema,
  ticketFiltersSchema,
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
      schema: { params: getTicketByIdSchema, tags: ["Tickets"] },
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
}
