import { useMutation } from "@tanstack/react-query";
import * as invitesApi from "./api";

export function useCreateInvite() {
  return useMutation({ mutationFn: invitesApi.createInvite });
}

export function useAcceptInvite() {
  return useMutation({ mutationFn: invitesApi.acceptInvite });
}
