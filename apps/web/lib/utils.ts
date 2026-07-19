import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MAX_FILE_SIZE_BYTES, ALLOWED_MIME_TYPES } from "@myapp/shared";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string | null) {
  return name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";
}

export function formatTimeRemaining(
  slaDueAt: string,
  slaBreached: boolean,
): string {
  if (slaBreached) return "Breached";

  const diffMs = new Date(slaDueAt).getTime() - Date.now();
  if (diffMs <= 0) return "Breached";

  const minutes = Math.floor(diffMs / 60_000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h left`;
  if (hours > 0) return `${hours}h ${minutes % 60}m left`;
  if (minutes > 0) return `${minutes}m left`;
  return "Less than a minute left";
}

export function validateFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File is too large. Max size is ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB.`;
  }
  if (
    !ALLOWED_MIME_TYPES.includes(
      file.type as (typeof ALLOWED_MIME_TYPES)[number],
    )
  ) {
    return "File type not allowed. Use PNG, JPEG, PDF, or plain text.";
  }
  return null;
}
