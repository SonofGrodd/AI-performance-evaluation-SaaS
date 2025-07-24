import express from 'express'
import { supabase } from '../utils/supabaseClient'
import { requireAuth } from '../middleware/auth'

const router = express.Router()

// Add a department
router.post('/', requireAuth, async (req, res) => {
  const user = (req as any).user
  const { name } = req.body

  // Get user's company
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('company_id')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) return res.status(404).json({ error: 'Company not found' })

  const { data: dept, error: deptError } = await supabase
    .from('departments')
    .insert([{ name, company_id: profile.company_id }])
    .select()
    .single()

  if (deptError) return res.status(400).json({ error: deptError.message })

  return res.status(201).json(dept)
})
// DELETE /api/v1/departments/:id
router.delete("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("departments")
    .delete()
    .eq("id", id);

  if (error) return res.status(400).json({ error: error.message });

  res.status(204).send(); // No Content
});

// PUT /api/v1/departments/:id
router.put("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Department name is required" });
  }

  const { data, error } = await supabase
    .from("departments")
    .update({
      name,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json(data);
});

// Get all departments for current company
router.get('/', requireAuth, async (req, res) => {
  const user = (req as any).user

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('company_id')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) return res.status(404).json({ error: 'Company not found' })

  const { data: departments, error } = await supabase
    .from('departments')
    .select('*')
    .eq('company_id', profile.company_id)

  if (error) return res.status(500).json({ error: error.message })

  return res.json(departments)
})

export default router
