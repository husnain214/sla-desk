import { ArrowRight } from "lucide-react";
import { EmptyState } from "./empty-state";

type HistoryEntry = {
  id: string;
  fromStatus: string;
  toStatus: string;
  createdAt: string;
  changedBy: { name: string };
};

export function TicketTimeline({ history }: { history: HistoryEntry[] }) {
  if (history.length === 0) {
    return <EmptyState message="No status changes yet." />;
  }

  return (
    <ol className="space-y-3 border-l border-border pl-4">
      {history.map((entry) => (
        <li key={entry.id} className="relative">
          <span className="absolute -left-5.25 top-1.5 size-2 rounded-full bg-primary" />
          <div className="flex items-center gap-1.5 text-sm text-foreground">
            <span className="capitalize text-muted-foreground">
              {entry.fromStatus}
            </span>
            <ArrowRight className="size-3 text-muted-foreground" />
            <span className="font-medium capitalize">{entry.toStatus}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {entry.changedBy.name} ·{" "}
            {new Date(entry.createdAt).toLocaleString()}
          </p>
        </li>
      ))}
    </ol>
  );
}
