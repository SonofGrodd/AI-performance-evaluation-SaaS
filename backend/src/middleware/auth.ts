// File: backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

// Make sure you have this in your .env:
// SUPABASE_JWT_SECRET=<the JWT secret used by Supabase to sign tokens>

interface AuthTokenPayload extends JwtPayload {
  sub: string;          // this is the user ID
  // you can add other custom claims here if you’ve set them
}

export function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  const token = header.slice(7); // strip off "Bearer "
  try {
    // Verify the JWT using your SUPABASE_JWT_SECRET
    const payload = jwt.verify(
      token,
      process.env.SUPABASE_JWT_SECRET!
    ) as AuthTokenPayload;

    // Attach the user ID from the token's "sub" claim
    res.locals.user = { id: payload.sub };
    return next();
  } catch (err: any) {
    console.error('[Auth] ❌ JWT verification failed:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
