// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { supabase } from "../utils/supabaseClient";

/**
 * Middleware to authenticate user and attach their role from Supabase
 */
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.decode(token) as { sub: string };

    if (!decoded || !decoded.sub) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const userId = decoded.sub;

    // Fetch user's role from Supabase
    const { data: profile, error } = await supabase
      .from("user_profiles")
      .select("id, role")
      .eq("id", userId)
      .single();

    if (error || !profile) {
      return res.status(403).json({ error: "User profile not found" });
    }

    // Attach user info to res.locals
    res.locals.user = {
      id: userId,
      role: profile.role,
    };

    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: "Unauthorized" });
  }
};
