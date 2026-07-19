import { Skeleton } from "@/components/ui/skeleton";

export function TicketRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 rounded-r-lg border border-border border-l-4 border-l-muted bg-card p-4">
      <div className="min-w-0 flex-1 space-y-1.5">
        <Skeleton className="h-3 w-14" />
        <Skeleton className="h-4 w-48" />
      </div>

      <Skeleton className="hidden h-5 w-16 rounded-full sm:inline-block" />

      <Skeleton className="h-5 w-20 rounded-full" />
    </div>
  );
}
