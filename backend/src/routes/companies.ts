import express from "express";
import { supabase } from "../utils/supabaseClient";
import { authenticateUser } from "../middleware/auth";

const router = express.Router();

// POST /api/v1/companies - Create a new company
router.post("/", authenticateUser, async (req, res) => {
  const user = res.locals.user;
  const { name, domain, industry, employee_count, subscription_plan } = req.body;

  const { data, error } = await supabase
    .from("companies")
    .insert([
      {
        name,
        domain,
        industry,
        employee_count,
        subscription_plan,
      },
    ])
    .select()
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  // Update user profile with company_id
  await supabase
    .from("user_profiles")
    .update({ company_id: data.id })
    .eq("id", user.id);

  res.status(201).json(data);
});

// GET /api/v1/companies/:id - Get a company by ID
router.get("/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "Company not found" });
  }

  res.json(data);
});

// PUT /api/v1/companies/:id - Update a company
router.put("/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const { data, error } = await supabase
    .from("companies")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    return res.status(400).json({ error: error?.message || "Update failed" });
  }

  res.json(data);
});

// DELETE /api/v1/companies/:id - Delete a company
router.delete("/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("companies")
    .delete()
    .eq("id", id);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(204).send();
});

export default router;
