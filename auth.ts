import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// By declaring this global namespace, we can add the 'user' property
// to the Express Request type, giving us autocompletion and type safety.
declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: string;
        aud: string;
        role: string;
      };
    }
  }
}

interface JwtPayload {
  sub: string; // 'sub' (subject) is the user ID in Supabase JWTs
  aud: string;
  role: string;
  // other claims...
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const jwtSecret = process.env.SUPABASE_JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('SUPABASE_JWT_SECRET is not set in .env file');
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    req.user = { id: decoded.sub, aud: decoded.aud, role: decoded.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};