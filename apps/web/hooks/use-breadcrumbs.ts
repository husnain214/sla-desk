"use client";

import { usePathname } from "next/navigation";
import { useTeams } from "@/features/teams/hooks";
import { useTicket } from "@/features/tickets/hooks";

type Breadcrumb = { label: string; href: string };

const STATIC_LABELS: Record<string, string> = {
  teams: "Teams",
  invites: "Invites",
  settings: "Settings",
};

export function useBreadcrumbs(): Breadcrumb[] {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const { data: teams } = useTeams();

  const isTicketDetail = segments[0] === "tickets" && segments.length === 2;
  const { data: ticket } = useTicket(isTicketDetail ? segments[1] : "");

  // root route ("/") is the tickets list itself
  if (segments.length === 0) {
    return [{ label: "Tickets", href: "/" }];
  }

  // any other top-level section (teams, settings, invites) starts its OWN root crumb —
  // "Tickets" has no business appearing on these at all
  const crumbs: Breadcrumb[] = [];

  return segments.reduce((acc, segment, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");

    if (STATIC_LABELS[segment]) {
      acc.push({ label: STATIC_LABELS[segment], href });
      return acc;
    }

    if (segments[0] === "teams" && i === 1) {
      const team = teams?.find((t) => t.id === segment);
      acc.push({ label: team?.name ?? "...", href });
      return acc;
    }

    if (segments[0] === "tickets" && i === 1) {
      acc.push({ label: ticket?.title ?? "...", href });
      return acc;
    }

    acc.push({ label: segment, href });
    return acc;
  }, crumbs);
}
