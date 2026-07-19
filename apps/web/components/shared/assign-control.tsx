"use client";

import { toast } from "sonner";
import { useAssignTicket } from "@/features/tickets/hooks";
import { useAuth } from "@/features/auth/hooks";
import { Button } from "@/components/ui/button";

interface AssignControlProps {
  ticketId: string;
  assignedAgentId: string | null;
  assignedAgentName: string | null;
}

export function AssignControl({
  ticketId,
  assignedAgentId,
  assignedAgentName,
}: AssignControlProps) {
  const { user } = useAuth();
  const mutation = useAssignTicket(ticketId);

  const isUnassigned = !assignedAgentId;
  const isAgent = user?.role === "agent";

  function handleClaim() {
    if (!user) return;
    mutation.mutate(
      { assignedAgentId: user.userId },
      { onError: (error) => toast.error(error.message) },
    );
  }

  if (!isUnassigned) {
    return (
      <span className="text-sm text-muted-foreground">
        Assigned to{" "}
        <span className="font-medium text-foreground">{assignedAgentName}</span>
      </span>
    );
  }

  if (isAgent) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={handleClaim}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Claiming..." : "Claim ticket"}
      </Button>
    );
  }

  return <span className="text-sm text-muted-foreground">Unassigned</span>;
}
