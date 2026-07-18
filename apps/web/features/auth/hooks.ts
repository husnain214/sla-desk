import { useMutation } from "@tanstack/react-query";
import { login, signup } from "./api";

export function useSignupMutation() {
  return useMutation({ mutationKey: ["signup"], mutationFn: signup });
}

export function useLoginMutation() {
  return useMutation({ mutationKey: ["login"], mutationFn: login });
}
