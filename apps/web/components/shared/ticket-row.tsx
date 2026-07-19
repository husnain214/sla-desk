import Link from "next/link";
import type { Ticket } from "@myapp/shared";
import { SlaPill } from "./sla-pill";
import { formatTimeRemaining } from "@/lib/utils";

const BORDER_COLOR: Record<Ticket["priority"], string> = {
  urgent: "border-l-urgent",
  high: "border-l-high",
  medium: "border-l-medium",
  low: "border-l-low",
};

export function TicketRow({ ticket }: { ticket: Ticket }) {
  return (
    <Link
      href={`/tickets/${ticket.id}`}
      className={`flex items-center justify-between gap-4 rounded-r-lg border border-border border-l-4 bg-card p-4 transition-colors hover:bg-muted/50 ${BORDER_COLOR[ticket.priority]}`}
    >
      <div className="min-w-0 flex-1">
        <p className="font-mono text-xs text-muted-foreground">
          #{ticket.id.slice(0, 6)}
        </p>
        <p className="truncate font-body text-sm text-foreground">
          {ticket.title}
        </p>
      </div>

      <span className="hidden shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs capitalize text-muted-foreground sm:inline-block">
        {ticket.status}
      </span>

      <SlaPill
        priority={ticket.priority}
        timeRemaining={formatTimeRemaining(ticket.slaDueAt, ticket.slaBreached)}
      />
    </Link>
  );
}
