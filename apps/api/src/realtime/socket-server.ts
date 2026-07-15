import type { FastifyInstance } from "fastify";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

import { env } from "../config/env";

export let io: Server;

export async function initSocketServer(app: FastifyInstance) {
  io = new Server(app.server, {
    cors: { origin: "*" },
  });

  const pubClient = createClient({ url: env.REDIS_URL });
  const subClient = pubClient.duplicate();

  await Promise.all([pubClient.connect(), subClient.connect()]);

  io.adapter(createAdapter(pubClient, subClient));

  app.addHook("preClose", (done) => {
    io.local.disconnectSockets(true);
    done();
  });

  return io;
}
