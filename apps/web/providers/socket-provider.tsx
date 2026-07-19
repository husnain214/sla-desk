"use client";

import { useEffect } from "react";
import { getSocket } from "@/lib/socket-client";
import { useAuth } from "@/features/auth/hooks";

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const socket = getSocket();
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return children;
}
