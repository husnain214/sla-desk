import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTags, tagTicket, untagTicket } from "./api";
import { queryKeys } from "@/lib/query-keys";

export function useTags() {
  return useQuery({ queryKey: ["tags"], queryFn: getTags });
}

export function useTagTicket(ticketId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tagId: string) => tagTicket(ticketId, tagId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.tickets.detail(ticketId) }),
  });
}
export function useUntagTicket(ticketId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tagId: string) => untagTicket(ticketId, tagId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.tickets.detail(ticketId) }),
  });
}
