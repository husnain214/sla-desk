"use client";

import { useRef } from "react";
import {
  useUploadAttachment,
  useDownloadAttachment,
} from "@/features/attachments/hooks";
import { validateFile } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Paperclip, Download, Upload } from "lucide-react";

type Attachment = {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function AttachmentList({
  ticketId,
  attachments,
}: {
  ticketId: string;
  attachments: Attachment[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending, progress } = useUploadAttachment(ticketId);
  const downloadMutation = useDownloadAttachment();

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      toast.error(validationError);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    mutate(file, {
      onError: (error) => toast.error(error.message),
      onSettled: () => {
        if (inputRef.current) inputRef.current.value = "";
      },
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Attachments</h3>
        <Button
          size="sm"
          variant="outline"
          disabled={isPending}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="size-4" />
          {isPending ? "Uploading..." : "Upload file"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {isPending && <Progress value={progress} className="h-1.5" />}

      {attachments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No attachments.</p>
      ) : (
        <div className="space-y-1">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Paperclip className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate text-sm text-foreground">
                  {attachment.fileName}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatFileSize(attachment.fileSize)}
                </span>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="size-8 shrink-0"
                onClick={() => downloadMutation.mutate(attachment.id)}
              >
                <Download className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
