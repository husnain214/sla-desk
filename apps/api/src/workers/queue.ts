import { Queue } from "bullmq";
import { env } from "../config/env";

export const slaBreachQueue = new Queue("sla-breach-check", {
  connection: { url: env.REDIS_URL },
});

export const escalationQueue = new Queue("ticket-escalation", {
  connection: { url: env.REDIS_URL },
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 }, // 5s, 10s, 20s between retries
  },
});
