import { z } from "zod";

const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "application/pdf",
  "text/plain",
] as const;

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export const requestUploadUrlSchema = z.object({
  fileName: z.string().min(1).max(255),
  fileSize: z.number().int().positive().max(MAX_FILE_SIZE_BYTES),
  mimeType: z.enum(ALLOWED_MIME_TYPES),
});

export const confirmUploadSchema = z.object({
  fileKey: z.string().min(1),
  fileName: z.string().min(1).max(255),
  fileSize: z.number().int().positive(),
  mimeType: z.string(),
});

export type RequestUploadUrlPayload = z.infer<typeof requestUploadUrlSchema>;
export type ConfirmUploadPayload = z.infer<typeof confirmUploadSchema>;
