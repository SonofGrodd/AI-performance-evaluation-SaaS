// src/routes/auth.ts
import express from 'express'
import { supabase } from '../utils/supabaseClient'

const router = express.Router()

// Signup
router.post('/signup', async (req, res) => {
  const { email, password, first_name, last_name, company_id, role } = req.body

  const { data: user, error } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: {
      first_name,
      last_name,
      role,
    }
  })

  if (error) return res.status(400).json({ error: error.message })

  // Create matching user_profile
  const { error: profileError } = await supabase
    .from('user_profiles')
    .insert([{
      id: user.user?.id,
      company_id,
      first_name,
      last_name,
      role
    }])

  if (profileError) return res.status(400).json({ error: profileError.message })

  return res.status(201).json({ user: user.user })
})

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return res.status(401).json({ error: error.message })

  return res.status(200).json({ session: data.session, user: data.user })
})

export default router
