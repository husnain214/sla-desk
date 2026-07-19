"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import * as ticketsApi from "./api";
import { AssignTicketPayload, TicketFiltersPayload } from "@myapp/shared";

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ticketsApi.createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}

export function useTickets(filters: Partial<TicketFiltersPayload>) {
  return useQuery({
    queryKey: queryKeys.tickets.all(filters),
    queryFn: () => ticketsApi.getTickets(filters),
  });
}

export function useTicket(id: string) {
  return useQuery({
    queryKey: queryKeys.tickets.detail(id),
    queryFn: () => ticketsApi.getTicketById(id),
  });
}

export function useUpdateTicketStatus(ticketId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: string) =>
      ticketsApi.updateTicketStatus(ticketId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tickets.detail(ticketId),
      });
    },
  });
}

export function useAssignTicket(ticketId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AssignTicketPayload) =>
      ticketsApi.assignTicket(ticketId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tickets.detail(ticketId),
      });
    },
  });
}

export function useTicketHistory(ticketId: string) {
  return useQuery({
    queryKey: queryKeys.tickets.history(ticketId),
    queryFn: () => ticketsApi.getTicketHistory(ticketId),
  });
}
