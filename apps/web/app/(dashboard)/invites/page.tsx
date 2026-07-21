"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInviteSchema, type CreateInvitePayload } from "@myapp/shared";
import { useCreateInvite } from "@/features/invites/hooks";
import { useTeams } from "@/features/teams/hooks";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

export default function InvitesPage() {
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const { data: teams } = useTeams();
  const createInviteMutation = useCreateInvite();

  const form = useForm<CreateInvitePayload>({
    resolver: zodResolver(createInviteSchema),
    defaultValues: { email: "", role: "agent", teamId: undefined },
  });

  function onSubmit(values: CreateInvitePayload) {
    createInviteMutation.mutate(values, {
      onSuccess: (invite) => {
        const link = `${window.location.origin}/invites/accept?token=${invite.token}`;
        setInviteLink(link);
        toast.success("Invite created");
        form.reset();
      },
      onError: (error) => toast.error(error.message),
    });
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="font-display text-2xl font-semibold text-foreground">
        Invite an agent
      </h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  {...field}
                  id="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter email address"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="teamId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="teamId">Team ID</FieldLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="No team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams?.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <Button
          type="submit"
          className="w-full"
          disabled={createInviteMutation.isPending}
        >
          {createInviteMutation.isPending ? "Creating..." : "Create invite"}
        </Button>
      </form>

      {inviteLink && (
        <div className="rounded-lg border border-border bg-muted p-3">
          <p className="text-xs text-muted-foreground mb-1">Share this link:</p>
          <p className="break-all font-mono text-xs text-foreground">
            {inviteLink}
          </p>
        </div>
      )}
    </div>
  );
}
