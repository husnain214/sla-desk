"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "@/lib/socket-client";
import { queryKeys } from "@/lib/query-keys";

export function useTicketRoom(ticketId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();

    socket.emit("join-ticket", ticketId);

    function handleTicketUpdated(updatedTicket: { id: string }) {
      queryClient.setQueryData(
        queryKeys.tickets.detail(ticketId),
        (old: any) => (old ? { ...old, ...updatedTicket } : old),
      );
    }

    function handleCommentCreated(comment: { ticketId: string }) {
      queryClient.setQueryData(
        queryKeys.tickets.detail(ticketId),
        (old: any) => {
          if (!old) return old;
          return { ...old, comments: [...(old.comments ?? []), comment] };
        },
      );
    }

    function handleSlaBreached(_: { id: string }) {
      queryClient.setQueryData(
        queryKeys.tickets.detail(ticketId),
        (old: any) => (old ? { ...old, slaBreached: true } : old),
      );
    }

    function handleJoinError({ message }: { message: string }) {
      console.error("Failed to join ticket room:", message);
    }

    socket.on("ticket:updated", handleTicketUpdated);
    socket.on("ticket:assigned", handleTicketUpdated);
    socket.on("comment:created", handleCommentCreated);
    socket.on("ticket:sla-breached", handleSlaBreached);
    socket.on("join-ticket:error", handleJoinError);

    return () => {
      socket.emit("leave-ticket", ticketId);
      socket.off("ticket:updated", handleTicketUpdated);
      socket.off("ticket:assigned", handleTicketUpdated);
      socket.off("comment:created", handleCommentCreated);
      socket.off("ticket:sla-breached", handleSlaBreached);
      socket.off("join-ticket:error", handleJoinError);
    };
  }, [ticketId, queryClient]);
}
