import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { TICKET_STATUSES, TICKET_PRIORITIES } from "@myapp/shared";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

type FilterState = {
  search: string;
  status: (typeof TICKET_STATUSES)[number] | null;
  priority: (typeof TICKET_PRIORITIES)[number] | null;
  page: number;
};

export function TicketFilters({
  filters,
  onFiltersChange,
}: {
  filters: FilterState;
  onFiltersChange: (patch: Partial<FilterState>) => void;
}) {
  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebouncedValue(searchInput, 400);

  useEffect(() => {
    onFiltersChange({ search: debouncedSearch, page: 1 }); // reset to page 1 on new search
  }, [debouncedSearch]);

  function clear() {
    setSearchInput("");
    onFiltersChange({ search: "", status: null, priority: null, page: 1 });
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
        onValueChange={(v) =>
          onFiltersChange({
            status: v === "all" ? null : (v as FilterState["status"]),
            page: 1,
          })
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {TICKET_STATUSES.map((s) => (
            <SelectItem key={s} value={s} className="capitalize">
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.priority ?? "all"}
        onValueChange={(v) =>
          onFiltersChange({
            priority: v === "all" ? null : (v as FilterState["priority"]),
            page: 1,
          })
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All priorities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All priorities</SelectItem>
          {TICKET_PRIORITIES.map((p) => (
            <SelectItem key={p} value={p} className="capitalize">
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="outline" size="sm" className="ml-auto" onClick={clear}>
        Clear filters
      </Button>
    </div>
  );
}
