"use client";

import { useParams } from "next/navigation";
import { useTicket } from "@/features/tickets/hooks";
import { useAuth } from "@/features/auth/hooks";
import { StatusSelect } from "@/components/shared/status-select";
import { AssignControl } from "@/components/shared/assign-control";
import { CommentThread } from "@/components/shared/comment-thread";
import { CommentComposer } from "@/components/shared/comment-composer";
import { SlaPill } from "@/components/shared/sla-pill";
import { Separator } from "@/components/ui/separator";
import { formatTimeRemaining } from "@/lib/utils";
import { AttachmentList } from "@/components/shared/attachment-list";
import { TicketTimelineSection } from "@/components/shared/ticket-timeline-section";
import { useTicketRoom } from "@/features/tickets/use-ticket-room";
import { Skeleton } from "@/components/ui/skeleton";

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: ticket, isLoading } = useTicket(id);

  useTicketRoom(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>
    );
  }

  if (!ticket) {
    return <p className="text-sm text-muted-foreground">Ticket not found.</p>;
  }

  const isStaff = user?.role === "agent" || user?.role === "admin";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-3">
        <p className="font-mono text-xs text-muted-foreground">
          #{ticket.id.slice(0, 8)}
        </p>
        <div className="flex items-start justify-between gap-4">
          <h1 className="font-display text-2xl font-semibold text-foreground">
            {ticket.title}
          </h1>
          <SlaPill
            priority={ticket.priority}
            timeRemaining={formatTimeRemaining(
              ticket.slaDueAt,
              ticket.slaBreached,
            )}
          />
        </div>
        {ticket.description && (
          <p className="text-sm text-muted-foreground">{ticket.description}</p>
        )}
      </div>

      <div className="flex items-center gap-6 rounded-lg border border-border bg-card p-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Status</p>
          <StatusSelect ticketId={ticket.id} status={ticket.status} />
        </div>
        <Separator orientation="vertical" className="h-8" />
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Assignment</p>
          <AssignControl
            ticketId={ticket.id}
            assignedAgentId={ticket.assignedAgentId}
            assignedAgentName={ticket.assignedAgent?.name ?? null}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Comments
        </h2>
        <CommentThread comments={ticket.comments ?? []} />
        <CommentComposer ticketId={ticket.id} canMarkInternal={isStaff} />
      </div>

      <Separator />
      <AttachmentList
        ticketId={ticket.id}
        attachments={ticket.attachments ?? []}
      />
      <Separator />
      <TicketTimelineSection ticketId={ticket.id} />
    </div>
  );
}
