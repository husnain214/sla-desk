import { Worker } from "bullmq";
import { createClient } from "redis";
import { Emitter } from "@socket.io/redis-emitter";
import { and, eq, lt, inArray } from "drizzle-orm";

import { db } from "../db";
import { tickets } from "../db/schemas/tickets.schema";
import { env } from "../config/env";
import { escalationQueue } from "./queue";

const redisClient = createClient({ url: env.REDIS_URL });
await redisClient.connect();
const emitter = new Emitter(redisClient);

export const slaBreachWorker = new Worker(
  "sla-breach-check",
  async () => {
    const now = new Date();

    const breached = await db
      .update(tickets)
      .set({ slaBreached: true })
      .where(
        and(
          lt(tickets.slaDueAt, now),
          eq(tickets.slaBreached, false),
          inArray(tickets.status, ["open", "pending"]),
        ),
      )
      .returning();

    if (breached.length > 0) {
      console.log(`SLA breach worker: flagged ${breached.length} ticket(s)`);

      for (const ticket of breached) {
        emitter.to(`ticket:${ticket.id}`).emit("ticket:sla-breached", ticket);
        await escalationQueue.add("escalate-breach", { ticket });
      }
    }
  },
  { connection: { url: env.REDIS_URL } },
);
