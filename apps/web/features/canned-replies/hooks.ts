import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCannedReply, getCannedReplies } from "./api";

export function useCannedReplies() {
  return useQuery({
    queryKey: ["canned-replies"],
    queryFn: getCannedReplies,
  });
}
export function useCreateCannedReply() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCannedReply,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["canned-replies"] }),
  });
}
