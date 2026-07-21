import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTeam, deleteTeam, getTeams } from "./api";

export function useTeams() {
  return useQuery({ queryKey: ["teams"], queryFn: getTeams });
}
export function useCreateTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTeam,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["teams"] }),
  });
}
export function useDeleteTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteTeam,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["teams"] }),
  });
}
