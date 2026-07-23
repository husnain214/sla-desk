"use client";

import { AppSidebar } from "@/components/shared/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProvider } from "@/providers/auth-provider";
import { SocketProvider } from "@/providers/socket-provider";
import { useAuth } from "@/features/auth/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { logout } from "@/features/auth/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // useEffect(() => {
  //   async function check() {
  //     if (!isLoading && !user) {
  //       router.push("/login");
  //       logout();
  //     }
  //   }

  //   check();
  // }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
      </div>
    );
  }

  return (
    <AuthProvider user={user}>
      <SocketProvider>
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1">
            <header className="flex items-center gap-3 border-b border-border px-6 py-3">
              <SidebarTrigger />
              <span className="font-display text-sm text-muted-foreground">
                Dashboard
              </span>
            </header>
            <div className="p-6">{children}</div>
          </main>
        </SidebarProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
