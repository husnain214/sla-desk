"use client";

import { useParams } from "next/navigation";
import { useAgents, useAssignUserToTeam } from "@/features/users/hooks";
import { useTeams } from "@/features/teams/hooks";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export default function TeamMembersPage() {
  const { id: teamId } = useParams<{ id: string }>();
  const { data: agents, isLoading } = useAgents();
  const { data: teams } = useTeams();
  const assignMutation = useAssignUserToTeam();

  const team = teams?.find((t) => t.id === teamId);
  const members = agents?.filter((a) => a.teamId === teamId) ?? [];
  const unassigned = agents?.filter((a) => a.teamId !== teamId) ?? [];

  function handleAdd(agentId: string) {
    assignMutation.mutate(
      { userId: agentId, teamId },
      { onError: (e) => toast.error(e.message) },
    );
  }

  function handleRemove(agentId: string) {
    assignMutation.mutate(
      { userId: agentId, teamId: null },
      { onError: (e) => toast.error(e.message) },
    );
  }

  if (isLoading) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="font-display text-2xl font-semibold text-foreground">
        {team?.name}
      </h1>

      <div className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground">Members</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-sm text-muted-foreground"
                >
                  No members yet.
                </TableCell>
              </TableRow>
            )}
            {members.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell>{agent.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {agent.email}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemove(agent.id)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Separator />

      <div className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground">
          Add an agent
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {unassigned.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-sm text-muted-foreground"
                >
                  No unassigned agents.
                </TableCell>
              </TableRow>
            )}
            {unassigned.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell>{agent.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {agent.email}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAdd(agent.id)}
                  >
                    Add
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
