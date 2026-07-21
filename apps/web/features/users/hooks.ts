import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assignUserToTeam, getAgents } from "./api";

export function useAgents() {
  return useQuery({ queryKey: ["users", "agents"], queryFn: getAgents });
}

export function useAssignUserToTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      teamId,
    }: {
      userId: string;
      teamId: string | null;
    }) => assignUserToTeam(userId, teamId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users", "agents"] }),
  });
}
