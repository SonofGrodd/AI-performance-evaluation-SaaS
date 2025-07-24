import { Request, Response, NextFunction } from "express";

/**
 * Role-based access middleware
 * @param roles - Allowed roles (e.g., ["manager", "employee"])
 */
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }

    next();
  };
};
