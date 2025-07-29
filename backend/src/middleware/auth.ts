import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { supabase } from "../utils/supabaseClient";

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET as string;
const SUPABASE_ISSUER = "https://dtusgubdpwzpgivgfmks.supabase.co"; // replace with your actual project URL
const EXPECTED_AUDIENCE = "authenticated"; // usually 'authenticated' unless customized

/**
 * Middleware: Authenticates the user via Bearer token, checks expiration, role, and email confirmation.
 */
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const ip = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn(`[Auth] ❌ Missing token from IP: ${ip}`);
    return res.status(401).json({ error: "Missing token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      sub: string;
      exp: number;
      aud: string;
      iss: string;
    };

    // 🔐 Verify token fields
    if (decoded.aud !== EXPECTED_AUDIENCE || decoded.iss !== SUPABASE_ISSUER) {
      console.warn(`[Auth] ❌ Invalid token source from IP: ${ip}`);
      return res.status(401).json({ error: "Invalid token source" });
    }

    const userId = decoded.sub;

    // 🧠 Lookup user profile
    const { data: profile, error } = await supabase
      .from("user_profiles")
      .select("id, role, email_confirmed")
      .eq("id", userId)
      .single();

    if (error || !profile) {
      console.warn(`[Auth] ❌ User profile not found for ID ${userId} from IP: ${ip}`);
      return res.status(403).json({ error: "User profile not found" });
    }

    if (!profile.email_confirmed) {
      return res.status(403).json({ error: "Email not confirmed" });
    }

    // ✅ Store user context
    res.locals.user = {
      id: userId,
      role: profile.role,
    };

    console.log(`[Auth] ✅ Authenticated user ${userId} from IP: ${ip}`);
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }

    console.error(`[Auth] ❌ Authentication failed from IP ${ip}:`, err.message);
    return res.status(401).json({ error: "Unauthorized" });
  }
};
