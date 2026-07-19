import type { TicketFiltersPayload } from "@myapp/shared";
import { useEffect, useState } from "react";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Filters = Partial<TicketFiltersPayload>;

interface TicketFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export function TicketFilters({
  filters,
  onFiltersChange,
}: TicketFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search ?? "");
  const debouncedSearch = useDebouncedValue(searchInput, 400);

  useEffect(() => {
    onFiltersChange({ ...filters, search: debouncedSearch || undefined });
  }, [debouncedSearch]);

  function update(patch: Partial<Filters>) {
    onFiltersChange({ ...filters, ...patch });
  }

  function clear() {
    setSearchInput("");
    onFiltersChange({});
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
      <Input
        placeholder="Search tickets..."
        className="max-w-xs"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />

      <Select
        value={filters.status ?? "all"}
        onValueChange={(value) =>
          update({
            status:
              value === "all"
                ? undefined
                : (value as TicketFiltersPayload["status"]),
          })
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.priority ?? "all"}
        onValueChange={(value) =>
          update({
            priority:
              value === "all"
                ? undefined
                : (value as TicketFiltersPayload["priority"]),
          })
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All priorities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All priorities</SelectItem>
          <SelectItem value="urgent">Urgent</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" size="sm" className="ml-auto" onClick={clear}>
        Clear filters
      </Button>
    </div>
  );
}
