import express from "express";
import { authenticateUser } from "../middleware/auth";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

// POST /api/v1/review-cycles
router.post("/", authenticateUser, async (req, res) => {
  const { name, description, start_date, end_date, review_type = "quarterly", status = "draft" } = req.body;
  const created_by = res.locals.user.id;

  if (!name || !start_date || !end_date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Fetch user's company 
  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("company_id")
    .eq("id", created_by)
    .single();

  if (profileError || !profile) return res.status(400).json({ error: "User profile not found" });

  const { data, error } = await supabase
    .from("review_cycles")
    .insert([
      {
        company_id: profile.company_id,
        name,
        description,
        start_date,
        end_date,
        review_type,
        status,
        created_by
      }
    ])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json(data);
});

// GET /api/v1/review-cycles
router.get("/", authenticateUser, async (req, res) => {
  const userId = res.locals.user.id;

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("company_id")
    .eq("id", userId)
    .single();

  if (profileError || !profile) return res.status(400).json({ error: "User profile not found" });

  const { data, error } = await supabase
    .from("review_cycles")
    .select("*")
    .eq("company_id", profile.company_id)
    .order("start_date", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json(data);
});

// PUT /api/v1/review-cycles/:id
router.put("/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body, updated_at: new Date().toISOString() };

  const { data, error } = await supabase
    .from("review_cycles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json(data);
});

// DELETE /api/v1/review-cycles/:id
router.delete("/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("review_cycles")
    .delete()
    .eq("id", id);

  if (error) return res.status(400).json({ error: error.message });

  res.status(204).send();
});

export default router;
