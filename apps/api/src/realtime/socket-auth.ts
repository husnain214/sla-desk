import type { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../modules/auth/auth.types";

import { env } from "../config/env";
import cookie from "cookie";

export function registerSocketAuth(io: Server) {
  io.use((socket: Socket, next) => {
    const rawCookies = socket.handshake.headers.cookie;

    if (!rawCookies) {
      return next(new Error("Unauthorized"));
    }

    const parsedCookies = cookie.parse(rawCookies);
    const token = parsedCookies.token;

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
