"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/features/auth/hooks";
import { Ticket, Users, Settings, LogOut, Mail } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { useCurrentUser } from "@/providers/auth-provider";

export function AppSidebar() {
  const user = useCurrentUser();
  const logoutMutation = useLogout();
  const router = useRouter();
  const pathname = usePathname();

  const isAgentOrAdmin = user?.role === "agent" || user?.role === "admin";
  const isAdmin = user?.role === "admin";

  const initials = getInitials(user?.name || "");

  function handleLogout() {
    logoutMutation.mutate(undefined, {
      onSuccess: () => router.push("/login"),
    });
  }

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-3">
        <span className="font-display text-lg font-semibold text-foreground">
          SLA Desk
        </span>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname === "/"}
              render={
                <Link href="/">
                  <Ticket className="size-4" />
                  <span>Tickets</span>
                </Link>
              }
            />
          </SidebarMenuItem>

          {isAgentOrAdmin && (
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname === "/teams"}
                render={
                  <Link href="/teams">
                    <Users className="size-4" />
                    <span>Teams</span>
                  </Link>
                }
              />
            </SidebarMenuItem>
          )}

          {isAdmin && (
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname === "/invites"}
                render={
                  <Link href="/invites">
                    <Mail className="size-4" />
                    <span>Invites</span>
                  </Link>
                }
              />
            </SidebarMenuItem>
          )}

          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname === "/settings"}
              render={
                <Link href="/settings">
                  <Settings className="size-4" />
                  <span>Settings</span>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button className="flex w-full items-center gap-2 rounded-md p-1.5 text-left hover:bg-muted">
                <Avatar className="size-8">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {user?.name ?? "..."}
                  </p>
                  <p className="truncate text-xs capitalize text-muted-foreground">
                    {user?.role ?? ""}
                  </p>
                </div>
              </button>
            }
          />

          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem render={<Link href="/settings">Settings</Link>} />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive"
            >
              <LogOut className="mr-2 size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
