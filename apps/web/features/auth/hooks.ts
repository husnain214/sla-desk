import { useMutation } from "@tanstack/react-query";
import { signup } from "./api";

export function useSignupMutation() {
  return useMutation({ mutationKey: ["signup"], mutationFn: signup });
}
