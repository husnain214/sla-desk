import type { JwtPayload } from "../auth/auth.types";
import type {
  RequestUploadUrlPayload,
  ConfirmUploadPayload,
} from "./attachments.types";

import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "node:crypto";

import { r2Client } from "../../config/r2";
import { env } from "../../config/env";
import * as ticketsService from "../tickets/tickets.service";
import * as attachmentsRepository from "./attachments.repository";
import { AppError } from "../../shared/errors/app-error";

export async function requestUploadUrl(
  ticketId: string,
  requestingUser: JwtPayload,
  payload: RequestUploadUrlPayload,
) {
  await ticketsService.getTicketById(ticketId, requestingUser); // access check, reused

  const fileKey = `tickets/${ticketId}/${crypto.randomUUID()}-${payload.fileName}`;

  const command = new PutObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: fileKey,
    ContentType: payload.mimeType,
    ContentLength: payload.fileSize,
  });

  const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 300 }); // 5 minutes to complete the upload

  return { uploadUrl, fileKey };
}

export async function confirmUpload(
  ticketId: string,
  requestingUser: JwtPayload,
  payload: ConfirmUploadPayload,
) {
  await ticketsService.getTicketById(ticketId, requestingUser);

  return attachmentsRepository.insertAttachment({
    ticketId,
    uploadedBy: requestingUser.userId,
    fileKey: payload.fileKey,
    fileName: payload.fileName,
    fileSize: payload.fileSize,
    mimeType: payload.mimeType,
  });
}

export async function getDownloadUrl(
  attachmentId: string,
  requestingUser: JwtPayload,
) {
  const attachment =
    await attachmentsRepository.findAttachmentById(attachmentId);
  if (!attachment) throw new AppError("Attachment not found", 404);

  await ticketsService.getTicketById(attachment.ticketId, requestingUser);

  const command = new GetObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: attachment.fileKey,
  });

  const downloadUrl = await getSignedUrl(r2Client, command, { expiresIn: 300 });

  return { downloadUrl, fileName: attachment.fileName };
}
