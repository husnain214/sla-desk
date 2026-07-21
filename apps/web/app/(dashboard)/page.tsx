"use client";

import {
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  type Ticket,
  type TicketFiltersPayload,
} from "@myapp/shared";

import {
  useQueryStates,
  parseAsString,
  parseAsStringEnum,
  parseAsInteger,
} from "nuqs";
import { useTickets } from "@/features/tickets/hooks";

import { CreateTicketDialog } from "@/components/shared/create-ticket-dialog";
import { TicketFilters } from "@/components/shared/ticket-filters";
import { TicketRow } from "@/components/shared/ticket-row";
import { TicketRowSkeleton } from "@/components/shared/ticket-row-skeleton";
import { EmptyState } from "@/components/shared/empty-state";

export default function Dashboard() {
  const [filters, setFilters] = useQueryStates({
    search: parseAsString.withDefault(""),
    status: parseAsStringEnum([...TICKET_STATUSES]),
    priority: parseAsStringEnum([...TICKET_PRIORITIES]),
    page: parseAsInteger.withDefault(1),
  });

  const apiFilters = {
    ...filters,
    search: filters.search || undefined,
    status: filters.status ?? undefined,
    priority: filters.priority ?? undefined,
  };

  const { data: tickets, isLoading } = useTickets(apiFilters);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Tickets
        </h1>
        <CreateTicketDialog />
      </div>

      <TicketFilters filters={filters} onFiltersChange={setFilters} />

      <div className="space-y-2">
        {isLoading && (
          <div className="space-y-2">
            <TicketRowSkeleton />
            <TicketRowSkeleton />
            <TicketRowSkeleton />
          </div>
        )}
        {!isLoading && tickets?.length === 0 && (
          <EmptyState message="No tickets yet — create your first one to get started." />
        )}

        {tickets?.map((ticket: Ticket) => (
          <TicketRow key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
}
