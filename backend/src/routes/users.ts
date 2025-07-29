// src/routes/users.ts
import express from 'express'
import { supabaseAdmin as supabase } from '../utils/supabaseAdminClient';
import { authenticateUser } from '../middleware/auth'
import { Request } from 'express';

const router = express.Router()

// Get current user's profile
router.get('/me', authenticateUser, async (req: Request, res) => {
  const user = res.locals.user;

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) return res.status(500).json({ error: error.message })
  return res.json(data)
})

// Admin: Get all users in your company
router.get('/', authenticateUser, async (req: Request, res) => {
  const user = res.locals.user;

  // Get current user's profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('company_id, role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin' && profile?.role !== 'hr') {
    return res.status(403).json({ error: 'Access denied' })
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('company_id', profile.company_id)

  if (error) return res.status(500).json({ error: error.message })
  return res.json(data)
})

// Update profile
router.patch('/me', authenticateUser, async (req: Request, res) => {
  const user = res.locals.user;
  const updates = req.body

  const { error } = await supabase
    .from('user_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', user.id)

  if (error) return res.status(500).json({ error: error.message })
  return res.json({ message: 'Profile updated' })
})

export default router
