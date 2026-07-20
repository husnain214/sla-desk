import { useQuery } from "@tanstack/react-query";
import { getAgents } from "./api";

export function useAgents() {
  return useQuery({ queryKey: ["users", "agents"], queryFn: getAgents });
}
