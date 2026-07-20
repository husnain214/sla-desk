"use client";

import { toast } from "sonner";
import { useAssignTicket } from "@/features/tickets/hooks";
import { useAuth } from "@/features/auth/hooks";
import { Button } from "@/components/ui/button";
import { useAgents } from "@/features/users/hooks";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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
  const { data: agents } = useAgents();
  const mutation = useAssignTicket(ticketId);

  const isUnassigned = !assignedAgentId;
  const isAgent = user?.role === "agent";
  const isAdmin = user?.role === "admin";

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

  if (isAdmin) {
    return (
      <Select
        value={assignedAgentId ?? undefined}
        onValueChange={(agentId) => {
          if (agentId) {
            mutation.mutate(
              { assignedAgentId: agentId },
              { onError: (e) => toast.error(e.message) },
            );
          }
        }}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Assign to agent..." />
        </SelectTrigger>
        <SelectContent>
          {agents?.map((agent) => (
            <SelectItem key={agent.id} value={agent.id}>
              {agent.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return <span className="text-sm text-muted-foreground">Unassigned</span>;
}
