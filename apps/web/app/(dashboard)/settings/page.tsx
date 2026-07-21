"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProfileSchema,
  type UpdateProfilePayload,
  changePasswordSchema,
  type ChangePasswordPayload,
} from "@myapp/shared";
import {
  useAuth,
  useUpdateProfile,
  useChangePassword,
} from "@/features/auth/hooks";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

export default function SettingsPage() {
  const { user } = useAuth();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  const profileForm = useForm<UpdateProfilePayload>({
    resolver: zodResolver(updateProfileSchema),
    values: { name: user?.name ?? "" },
  });

  const passwordForm = useForm<ChangePasswordPayload>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "" },
  });

  function onProfileSubmit(values: UpdateProfilePayload) {
    updateProfileMutation.mutate(values, {
      onSuccess: () => toast.success("Profile updated"),
      onError: (e) => toast.error(e.message),
    });
  }

  function onPasswordSubmit(values: ChangePasswordPayload) {
    changePasswordMutation.mutate(values, {
      onSuccess: () => {
        toast.success("Password changed");
        passwordForm.reset();
      },
      onError: (e) => toast.error(e.message),
    });
  }

  return (
    <div className="mx-auto max-w-md space-y-8">
      <h1 className="font-display text-2xl font-semibold text-foreground">
        Settings
      </h1>

      <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
        <span className="text-sm text-foreground">Appearance</span>
        <ThemeToggle />
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Profile
        </h2>

        <form
          onSubmit={profileForm.handleSubmit(onProfileSubmit)}
          className="space-y-4"
        >
          <Controller
            name="name"
            control={profileForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  {...field}
                  id="name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter name "
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button type="submit" disabled={updateProfileMutation.isPending}>
            Save profile
          </Button>
        </form>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Change password
        </h2>
        <form
          onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
          className="space-y-4"
        >
          <FieldGroup>
            <Controller
              name="currentPassword"
              control={passwordForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="currentPassword">
                    Current Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="currentPassword"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter current password"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="newPassword"
              control={passwordForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                  <Input
                    {...field}
                    id="newPassword"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter new password"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <Button type="submit" disabled={changePasswordMutation.isPending}>
            Change password
          </Button>
        </form>
      </div>
    </div>
  );
}
