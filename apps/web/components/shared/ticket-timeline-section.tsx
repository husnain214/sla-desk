"use client";

import { useTicketHistory } from "@/features/tickets/hooks";
import { TicketTimeline } from "./ticket-timeline";
import { Skeleton } from "../ui/skeleton";

export function TicketTimelineSection({ ticketId }: { ticketId: string }) {
  const { data: history, isLoading } = useTicketHistory(ticketId);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="font-display text-lg font-semibold text-foreground">
        History
      </h2>
      <TicketTimeline history={history ?? []} />
    </div>
  );
}
