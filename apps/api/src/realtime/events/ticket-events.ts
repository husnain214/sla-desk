import type { Server, Socket } from "socket.io";

export function registerTicketHandlers(io: Server, socket: Socket) {
  socket.on("join-ticket", (ticketId: string) => {
    // TODO: verify this user is actually allowed to view this ticket
    // before letting them join the room (reuse your existing access check)
    socket.join(`ticket:${ticketId}`);
  });

  socket.on("leave-ticket", (ticketId: string) => {
    socket.leave(`ticket:${ticketId}`);
  });
}
