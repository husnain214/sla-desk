import { Worker } from "bullmq";
import { env } from "../config/env";
import { db } from "../db";
import { tickets } from "../db/schemas/tickets.schema";
import { and, eq, inArray, lt } from "drizzle-orm";
import { escalationQueue } from "./queue";

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
      .returning({
        id: tickets.id,
        title: tickets.title,
        priority: tickets.priority,
        assignedAgentId: tickets.assignedAgentId,
        assignedTeamId: tickets.assignedTeamId,
      });

    if (breached.length > 0) {
      console.log(`SLA breach worker: flagged ${breached.length} ticket(s)`);

      await Promise.all(
        breached.map((ticket) =>
          escalationQueue.add("escalate-breach", { ticket }),
        ),
      );
    }
  },
  {
    connection: { url: env.REDIS_URL },
  },
);
