import express from "express";
import { supabase } from "../utils/supabaseClient";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

// Get current user's profile
router.get('/me', requireAuth, async (req, res) => {
  const user = req.user!;

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

// Admin: Get all users in your company
router.get('/', requireAuth, async (req, res) => {
  const user = req.user!;

  // Get current user's profile to check role and company
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('company_id, role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return res.status(404).json({ error: 'User profile not found' });
  }

  if (profile.role !== 'admin' && profile.role !== 'hr') {
    return res.status(403).json({ error: 'Access denied. Admin or HR role required.' });
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('company_id', profile.company_id);

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

// Update current user's profile
router.patch('/me', requireAuth, async (req, res) => {
  const user = req.user!;
  const { role, company_id, id, ...updates } = req.body; // Prevent role/company escalation

  const { data, error } = await supabase
    .from('user_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.json({ message: 'Profile updated', user: data });
});

// POST /api/v1/users/sync-profile
router.post("/sync-profile", requireAuth, async (req, res) => {
  const userId = req.user!.id;
  const {
    company_id,
    first_name,
    last_name,
    role = "employee",
    department,
    job_title
  } = req.body;

  if (!company_id || !first_name || !last_name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Check if profile already exists
  const { data: existingProfile } = await supabase
    .from("user_profiles")
    .select("id")
    .eq("id", userId)
    .single();

  if (existingProfile) {
    return res.status(409).json({ message: "Profile already exists" });
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .insert([
      {
        id: userId,
        company_id,
        first_name,
        last_name,
        role,
        department,
        job_title
      }
    ])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json(data);
});

export default router;
