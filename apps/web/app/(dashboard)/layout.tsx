"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProvider } from "@/providers/auth-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  if (isLoading) return "loading";

  if (!user) {
    return router.push("/login");
  }

  return (
    <AuthProvider user={user}>
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
    </AuthProvider>
  );
}
