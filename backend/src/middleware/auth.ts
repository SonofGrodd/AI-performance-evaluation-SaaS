import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { supabase } from "../utils/supabaseClient";

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Decode token to extract user ID
    const decoded = jwt.decode(token) as { sub: string };
    if (!decoded || !decoded.sub) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Fetch user role from Supabase user_profiles table
    const { data: profile, error } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", decoded.sub)
      .single();

    if (error || !profile) {
      return res.status(403).json({ error: "User profile not found" });
    }

    // Attach user ID and role to response local object
    res.locals.user = {
      id: decoded.sub,
      role: profile.role || "employee" // default fallback
    };

    next();
  } catch (err) {
    console.error("Authentication error:", err);
    return res.status(401).json({ error: "Unauthorized" });
  }
};
