import { api } from "@/lib/axios";

export async function requestUploadUrl(
  ticketId: string,
  payload: { fileName: string; fileSize: number; mimeType: string },
) {
  const res = await api.post(
    `/tickets/${ticketId}/attachments/upload-url`,
    payload,
  );
  return res.data as { uploadUrl: string; fileKey: string };
}

export async function confirmUpload(
  ticketId: string,
  payload: {
    fileKey: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  },
) {
  const res = await api.post(`/tickets/${ticketId}/attachments`, payload);
  return res.data;
}

export async function getDownloadUrl(attachmentId: string) {
  const res = await api.get(`/attachments/${attachmentId}/download-url`);
  return res.data as { downloadUrl: string; fileName: string };
}
