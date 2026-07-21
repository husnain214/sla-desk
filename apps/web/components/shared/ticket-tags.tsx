"use client";

import { useTags, useTagTicket, useUntagTicket } from "@/features/tags/hooks";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { X } from "lucide-react";
import type { Tag } from "@myapp/shared";

export function TicketTags({
  ticketId,
  tags,
}: {
  ticketId: string;
  tags: Tag[];
}) {
  const { data: allTags } = useTags();
  const tagMutation = useTagTicket(ticketId);
  const untagMutation = useUntagTicket(ticketId);

  const availableTags = allTags?.filter(
    (t) => !tags.some((tt) => tt.id === t.id),
  );

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tags.map((tag) => (
        <Badge key={tag.id} variant="secondary" className="gap-1">
          {tag.name}
          <button onClick={() => untagMutation.mutate(tag.id)}>
            <X className="size-3" />
          </button>
        </Badge>
      ))}

      {availableTags && availableTags.length > 0 && (
        <Select
          onValueChange={(tagId: string | null) => {
            if (tagId) tagMutation.mutate(tagId);
          }}
        >
          <SelectTrigger className="h-6 w-28 text-xs">
            <SelectValue placeholder="+ Add tag" />
          </SelectTrigger>
          <SelectContent>
            {availableTags.map((tag: Tag) => (
              <SelectItem key={tag.id} value={tag.id}>
                {tag.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
