"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as authApi from "@/features/auth/api";
import { useRouter } from "next/navigation";

export function QueryProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  async function logout() {
    await authApi.logout();
    router.push("/login");
  }

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry(failureCount, error) {
              if (error.message === "Unauthorized") {
                logout();
                return false;
              }

              return failureCount < 3;
            },
            retryDelay: 1000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
