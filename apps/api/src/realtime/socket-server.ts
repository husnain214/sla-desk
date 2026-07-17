import type { FastifyInstance } from "fastify";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";

import { env } from "../config/env";

export let io: Server;

export async function initSocketServer(app: FastifyInstance) {
  io = new Server(app.server, {
    cors: { origin: env.FRONTEND_URL, credentials: true },
  });

  const pubClient = new Redis(env.REDIS_URL);
  const subClient = pubClient.duplicate();

  await Promise.all([
    new Promise((resolve, reject) => {
      pubClient.once("ready", resolve);
      pubClient.once("error", reject);
    }),
    new Promise((resolve, reject) => {
      subClient.once("ready", resolve);
      subClient.once("error", reject);
    }),
  ]);

  io.adapter(createAdapter(pubClient, subClient));

  app.addHook("preClose", (done) => {
    io.local.disconnectSockets(true);
    done();
  });

  return io;
}
