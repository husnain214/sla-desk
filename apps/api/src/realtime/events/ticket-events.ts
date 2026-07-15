import type { Server, Socket } from "socket.io";
import * as ticketService from "../../modules/tickets/tickets.service";
import { AppError } from "../../shared/errors/app-error";

export function registerTicketHandlers(io: Server, socket: Socket) {
  socket.on("join-ticket", async (ticketId: string) => {
    const user = socket.data.user;

    try {
      await ticketService.getTicketById(ticketId, user);
      socket.join(`ticket:${ticketId}`);
      socket.emit("join-ticket:success", { ticketId });
    } catch (err) {
      if (err instanceof AppError) {
        socket.emit("join-ticket:error", { ticketId, message: err.message });
      } else {
        socket.emit("join-ticket:error", {
          ticketId,
          message: "Something went wrong",
        });
      }
    }
  });

  socket.on("leave-ticket", (ticketId: string) => {
    socket.leave(`ticket:${ticketId}`);
  });
}
