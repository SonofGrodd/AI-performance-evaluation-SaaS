// File: backend/src/routes/auth.ts
import { Router } from 'express';
import { supabase } from '../utils/supabaseAnonClient';

const router = Router();

/**
 * POST /api/v1/auth/login
 * Body: { email, password }
 * Returns: { session: { access_token, ... } }
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      return res.status(401).json({ error: error?.message || 'Invalid credentials' });
    }

    // Return the session object (including access_token)
    return res.json({ session: data.session });
  } catch (err: any) {
    console.error('POST /auth/login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
