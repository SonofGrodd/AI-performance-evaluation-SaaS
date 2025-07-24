import express from 'express'
import { supabase } from '../utils/supabaseClient'
import { requireAuth } from '../middleware/auth'

const router = express.Router()
// DELETE /api/v1/companies/:id
router.delete("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("companies")
    .delete()
    .eq("id", id);

  if (error) return res.status(400).json({ error: error.message });

  res.status(204).send(); // No Content
});

// PUT /api/v1/companies/:id
router.put("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { name, domain, industry, employee_count, subscription_plan } = req.body;
console.log("PUT /api/v1/companies/:id hit");

  const { data, error } = await supabase
    .from("companies")
    .update({
      name,
      domain,
      industry,
      employee_count,
      subscription_plan,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json(data);
});


// Create a new company and set current user as admin
router.post('/', requireAuth, async (req, res) => {
     console.log("📥 Incoming request to /api/v1/companies");
  const user = (req as any).user
  const { name, domain, industry, plan } = req.body

  const { data: company, error: companyError } = await supabase
    .from('companies')
    .insert([{ name, domain, industry, subscription_plan: plan || 'starter' }])
    .select()
    .single()

  if (companyError) return res.status(400).json({ error: companyError.message })

  // Assign current user to company as admin
  const { error: profileError } = await supabase
    .from('user_profiles')
    .update({
      company_id: company.id,
      role: 'admin',
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)

  if (profileError) return res.status(500).json({ error: profileError.message })

  return res.status(201).json({ message: 'Company created', company })
})

// Get current user's company
router.get('/me', requireAuth, async (req, res) => {
  const user = (req as any).user

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('company_id')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) return res.status(404).json({ error: 'Company not found' })

  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('*')
    .eq('id', profile.company_id)
    .single()

  if (companyError) return res.status(500).json({ error: companyError.message })

  return res.json(company)
})

export default router
