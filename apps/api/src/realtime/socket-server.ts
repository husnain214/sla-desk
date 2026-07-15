import { Server } from "socket.io";
import type { FastifyInstance } from "fastify";

export let io: Server;

export function initSocketServer(app: FastifyInstance) {
  io = new Server(app.server, {
    cors: { origin: "*" },
  });

  return io;
}
