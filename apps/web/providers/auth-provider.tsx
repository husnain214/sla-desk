"use client";

import { createContext, useContext } from "react";

type User = { id: string; name: string; email: string; role: string };

const AuthContext = createContext<User | null>(null);

export function AuthProvider({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export function useCurrentUser() {
  const user = useContext(AuthContext);
  return user;
}
