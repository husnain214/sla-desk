"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCreateComment } from "@/features/comments/hooks";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function CommentComposer({
  ticketId,
  canMarkInternal,
}: {
  ticketId: string;
  canMarkInternal: boolean;
}) {
  const [body, setBody] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const mutation = useCreateComment(ticketId);

  function handleSubmit() {
    if (!body.trim()) return;

    mutation.mutate(
      { body, isInternal },
      {
        onSuccess: () => {
          setBody("");
          setIsInternal(false);
        },
        onError: (error) => toast.error(error.message),
      },
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-4">
      <Textarea
        placeholder="Write a reply..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="flex items-center justify-between">
        {canMarkInternal ? (
          <div className="flex items-center gap-2">
            <Switch
              checked={isInternal}
              onCheckedChange={setIsInternal}
              id="internal-toggle"
            />
            <Label
              htmlFor="internal-toggle"
              className="text-sm text-muted-foreground"
            >
              Internal note
            </Label>
          </div>
        ) : (
          <span />
        )}
        <Button
          onClick={handleSubmit}
          disabled={mutation.isPending || !body.trim()}
          size="sm"
        >
          {mutation.isPending ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
}
