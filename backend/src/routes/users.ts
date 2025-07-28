// File: backend/src/routes/users.ts
import { Router } from 'express';
import { requireAuth } from '../middleware/auth';      // your JWT guard
import supabase from '../lib/supabaseClient';          // your initialized supabase-js client

const router = Router();

/**
 * GET /api/v1/users/me
 * Returns the application‑level user profile (including role) for the logged in user.
 */
router.get(
  '/me',
  requireAuth,             // ensures req.user.id is set
  async (req, res) => {
    try {
      // 1) Grab the authenticated user’s ID from the JWT middleware
      const userId = (req.user as { id: string }).id;

      // 2) Fetch their profile (role) from Supabase
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      // 3) Return just the role (and any other profile fields you want)
      return res.json({ role: data.role });
    } catch (err: any) {
      console.error('Error in GET /users/me:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
