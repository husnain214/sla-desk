import { TicketRowSkeleton } from "@/components/shared/ticket-row-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function TicketsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-9 w-28" />
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="space-y-2">
        <TicketRowSkeleton />
        <TicketRowSkeleton />
        <TicketRowSkeleton />
      </div>
    </div>
  );
}
