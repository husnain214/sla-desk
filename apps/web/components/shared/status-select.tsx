"use client";

import { useUpdateTicketStatus } from "@/features/tickets/hooks";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const STATUSES = ["open", "pending", "resolved", "closed"] as const;

interface StatusSelectProps {
  ticketId: string;
  status: string;
}

export function StatusSelect({ ticketId, status }: StatusSelectProps) {
  const mutation = useUpdateTicketStatus(ticketId);

  function handleChange(newStatus: string) {
    mutation.mutate(newStatus, {
      onError: (error) => toast.error(error.message),
    });
  }

  return (
    <Select
      value={status}
      onValueChange={(value) => {
        if (value) handleChange(value);
      }}
      disabled={mutation.isPending}
    >
      <SelectTrigger className="w-36 capitalize">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((s) => (
          <SelectItem key={s} value={s} className="capitalize">
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
