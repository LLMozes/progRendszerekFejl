import type { Request, Response, NextFunction } from "express";
import type { Role } from "@prisma/client";

declare module "express-session" {
  interface SessionData {
    user?: {
      id: number;
      role: Role;
    };
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  return next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  if (req.session.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin access required." });
  }

  return next();
}
