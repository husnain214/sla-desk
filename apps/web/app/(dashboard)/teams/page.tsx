"use client";

import { useState } from "react";
import Link from "next/link";
import { useTeams, useCreateTeam, useDeleteTeam } from "@/features/teams/hooks";
import { useAuth } from "@/features/auth/hooks";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2 } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export default function TeamsPage() {
  const { user } = useAuth();
  const { data: teams, isLoading } = useTeams();
  const createMutation = useCreateTeam();
  const deleteMutation = useDeleteTeam();
  const [name, setName] = useState("");

  const isAdmin = user?.role === "admin";

  function handleCreate() {
    if (!name.trim()) return;
    createMutation.mutate(
      { name },
      {
        onSuccess: () => setName(""),
        onError: (e) => toast.error(e.message),
      },
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-2xl font-semibold text-foreground">
        Teams
      </h1>

      {isAdmin && (
        <div className="flex gap-2">
          <Input
            placeholder="New team name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button onClick={handleCreate} disabled={createMutation.isPending}>
            Create
          </Button>
        </div>
      )}

      {isLoading ? (
        <Skeleton className="h-32 w-full rounded-lg" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="text-center text-sm text-muted-foreground"
                >
                  No teams yet.
                </TableCell>
              </TableRow>
            )}
            {teams?.map((team) => (
              <TableRow key={team.id}>
                <TableCell>
                  <Link
                    href={`/teams/${team.id}`}
                    className="font-medium text-foreground hover:underline"
                  >
                    {team.name}
                  </Link>
                </TableCell>
                <TableCell className="text-right">
                  {isAdmin && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        deleteMutation.mutate(team.id, {
                          onError: (e) => toast.error(e.message),
                        })
                      }
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
