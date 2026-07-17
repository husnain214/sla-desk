import type { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import type { JwtPayload } from "../modules/auth/auth.types";
import { parseCookies } from "../shared/utils/auth";

export function registerSocketAuth(io: Server) {
  io.use((socket: Socket, next) => {
    const cookies = parseCookies(socket.handshake.headers.cookie);
    const token = cookies.token;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      socket.data.user = payload;
      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });
}
