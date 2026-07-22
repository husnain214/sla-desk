import { AcceptInviteForm } from "@/components/shared/accept-invite-form";

interface AcceptInvitePageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function AcceptInvitePage({
  searchParams,
}: AcceptInvitePageProps) {
  const { token = "" } = await searchParams;

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Missing or invalid invite link.
        </p>
      </div>
    );
  }

  return <AcceptInviteForm token={token} />;
}
