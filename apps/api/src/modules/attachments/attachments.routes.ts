import { z } from "zod";

import { AppInstance } from "../../types";
import { authenticate } from "../auth/auth.middleware";
import { ticketParamsSchema } from "../comments/comments.types";
import * as attachmentService from "./attachments.service";
import {
  confirmUploadSchema,
  requestUploadUrlSchema,
} from "./attachments.types";

export async function attachmentRoutes(fastify: AppInstance) {
  fastify.post(
    "/:ticketId/attachments/upload-url",
    {
      preHandler: [authenticate],
      schema: { params: ticketParamsSchema, body: requestUploadUrlSchema },
    },
    async (request, reply) => {
      const result = await attachmentService.requestUploadUrl(
        request.params.ticketId,
        request.user,
        request.body,
      );
      reply.send(result);
    },
  );

  fastify.post(
    "/:ticketId/attachments",
    {
      preHandler: [authenticate],
      schema: { params: ticketParamsSchema, body: confirmUploadSchema },
    },
    async (request, reply) => {
      const attachment = await attachmentService.confirmUpload(
        request.params.ticketId,
        request.user,
        request.body,
      );
      reply.code(201).send(attachment);
    },
  );

  fastify.get(
    "/attachments/:id/download-url",
    {
      preHandler: [authenticate],
      schema: { params: z.object({ id: z.uuid() }) },
    },
    async (request, reply) => {
      const result = await attachmentService.getDownloadUrl(
        request.params.id,
        request.user,
      );
      reply.send(result);
    },
  );
}
