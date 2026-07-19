"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { queryKeys } from "@/lib/query-keys";
import * as attachmentsApi from "./api";

export function useUploadAttachment(ticketId: string) {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      setProgress(0);

      const { uploadUrl, fileKey } = await attachmentsApi.requestUploadUrl(
        ticketId,
        {
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
        },
      );

      await axios.put(uploadUrl, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (event) => {
          if (event.total) {
            setProgress(Math.round((event.loaded / event.total) * 100));
          }
        },
      });

      return attachmentsApi.confirmUpload(ticketId, {
        fileKey,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tickets.detail(ticketId),
      });
    },
    onSettled: () => {
      setProgress(0);
    },
  });

  return { ...mutation, progress };
}

export function useDownloadAttachment() {
  return useMutation({
    mutationFn: attachmentsApi.getDownloadUrl,
    onSuccess: (data) => {
      window.open(data.downloadUrl, "_blank");
    },
  });
}
