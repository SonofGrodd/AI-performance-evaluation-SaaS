import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
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
    
    console.log("✅ Authenticated user ID:", decoded.sub);


    res.locals.user = {
      id: decoded.sub // this is the Supabase user ID
    };

    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: "Unauthorized" });
  }
};
