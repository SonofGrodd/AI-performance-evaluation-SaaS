// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { supabase } from "../utils/supabaseClient";

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET as string;

/**
 * Authenticates the user via Bearer token and validates expiration.
 */
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 🔐 Verify the token with secret
    const decoded = jwt.verify(token, JWT_SECRET) as {
      sub: string;
      exp: number;
    };

    const userId = decoded.sub;

    // ✅ Get role from Supabase
    const { data: profile, error } = await supabase
      .from("user_profiles")
      .select("id, role")
      .eq("id", userId)
      .single();

    if (error || !profile) {
      return res.status(403).json({ error: "User profile not found" });
    }

    res.locals.user = {
      id: userId,
      role: profile.role,
    };

    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }

    console.error(err);
    return res.status(401).json({ error: "Unauthorized" });
  }
};
