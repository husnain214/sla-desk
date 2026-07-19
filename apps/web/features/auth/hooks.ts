"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import * as authApi from "./api";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: authApi.getMe,
    retry: false,
  });

  return { user, isLoading };
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: authApi.signup,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.auth.me, null);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}
