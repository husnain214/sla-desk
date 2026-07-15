import type { FastifyInstance } from "fastify";

import { initSocketServer } from "./socket-server";
import { registerSocketAuth } from "./socket-auth";
import { registerTicketHandlers } from "./events/ticket-events";

export function setupRealtime(app: FastifyInstance) {
  const io = initSocketServer(app);
  registerSocketAuth(io);

  io.on("connection", (socket) => {
    registerTicketHandlers(io, socket);
  });

  return io;
}
