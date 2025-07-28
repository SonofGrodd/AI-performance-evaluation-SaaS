// File: backend/src/routes/users.ts
import { Router } from 'express';
// 1) use the actual middleware export
import { authenticateUser } from '../middleware/auth';
 // 2) fix the import path to your Supabase client
import { supabase } from '../utils/supabaseClient';

const router = Router();

/**
 * GET /api/v1/users/me
 * Returns the application‑level role for the current user.
 */
router.get(
  '/me',
  authenticateUser,  // ← was requireAuth :contentReference[oaicite:2]{index=2}
  async (req, res) => {
    // 3) pull the user ID set by your middleware
    const { id: userId } = res.locals.user as { id: string };

    const { data, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ role: data.role });
  }
);

export default router;
