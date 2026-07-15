import { Worker } from "bullmq";
import { env } from "../config/env";

export const escalationWorker = new Worker(
  "ticket-escalation",
  async (job) => {
    const { ticket } = job.data;

    // Placeholder for real notification — swap this out later for
    // an actual email (Postmark/SendGrid) or Slack webhook call.
    console.log(
      `[ESCALATION] Ticket "${ticket.title}" (${ticket.priority}) breached SLA. ` +
        `Assigned agent: ${ticket.assignedAgentId ?? "unassigned"}, team: ${ticket.assignedTeamId ?? "none"}.`,
    );
    // future:
    // if (ticket.assignedAgentId) await sendEmail(...)
    // else await notifyTeamChannel(ticket.assignedTeamId)
  },
  { connection: { url: env.REDIS_URL } },
);

escalationWorker.on("failed", (job, err) => {
  console.error(`Escalation job ${job?.id} failed:`, err.message);
});
