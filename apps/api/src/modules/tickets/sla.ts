import { ticketPriorityEnum } from "../../db/schemas/tickets.schema";

type Priority = (typeof ticketPriorityEnum.enumValues)[number];

const SLA_HOURS_BY_PRIORITY: Record<Priority, number> = {
  urgent: 1,
  high: 4,
  medium: 24,
  low: 72,
};

export function calculateSlaDueAt(
  priority: Priority,
  from: Date = new Date(),
): Date {
  const hours = SLA_HOURS_BY_PRIORITY[priority];
  return new Date(from.getTime() + hours * 60 * 60 * 1000);
}
