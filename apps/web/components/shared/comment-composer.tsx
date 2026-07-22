"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCreateComment } from "@/features/comments/hooks";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  useCannedReplies,
  useCreateCannedReply,
} from "@/features/canned-replies/hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { BookmarkPlus } from "lucide-react";

export function CommentComposer({
  ticketId,
  canMarkInternal,
}: {
  ticketId: string;
  canMarkInternal: boolean;
}) {
  const [body, setBody] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [selectedReply, setSelectedReply] = useState("");
  const mutation = useCreateComment(ticketId);

  const { data: cannedReplies } = useCannedReplies();
  const saveCannedReplyMutation = useCreateCannedReply();

  function insertCannedReply(replyId: string) {
    const reply = cannedReplies?.find((r) => r.id === replyId);
    if (reply) setBody(reply.body);
  }

  function saveCurrentAsCannedReply() {
    const title = window.prompt("Name this canned reply:");
    if (!title || !body.trim()) return;
    saveCannedReplyMutation.mutate(
      { title, body },
      {
        onSuccess(data) {
          setSelectedReply(data.id);
        },
      },
    );
  }

  function handleSubmit() {
    if (!body.trim()) return;

    mutation.mutate(
      { body, isInternal },
      {
        onSuccess: () => {
          setBody("");
          setIsInternal(false);
          setSelectedReply("");
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
        <div className="flex items-center gap-3">
          {canMarkInternal && (
            <>
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

              {cannedReplies && cannedReplies.length > 0 && (
                <Select
                  value={selectedReply}
                  onValueChange={(replyId) => {
                    setSelectedReply(replyId as string);
                    if (replyId) insertCannedReply(replyId as string);
                  }}
                >
                  <SelectTrigger className="h-8 w-40 text-xs">
                    <SelectValue placeholder="Insert canned reply">
                      {(value) =>
                        cannedReplies?.find((r) => r.id === value)?.title ??
                        "Insert canned reply"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {cannedReplies.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Button
                size="icon"
                variant="ghost"
                className="size-8"
                onClick={saveCurrentAsCannedReply}
                title="Save as canned reply"
                disabled={body.length === 0}
              >
                <BookmarkPlus className="size-4" />
              </Button>
            </>
          )}
        </div>

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
