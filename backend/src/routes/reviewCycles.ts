import express from "express";
import { supabase } from "../utils/supabaseClient";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

// POST /api/v1/review-cycles
router.post("/", requireAuth, async (req, res) => {
  const { name, description, start_date, end_date, review_type } = req.body;
  const userId = (req as any).user.id;

  // Fetch the user's company_id
  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("company_id")
    .eq("id", userId)
    .single();

  if (profileError) return res.status(400).json({ error: "User profile not found" });

  const { data, error } = await supabase
    .from("review_cycles")
    .insert([
      {
        name,
        description,
        start_date,
        end_date,
        review_type,
        company_id: profile.company_id,
        created_by: userId,
      },
    ])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json(data);
});

// GET /api/v1/review-cycles
router.get("/", requireAuth, async (req, res) => {
  const userId = (req as any).user.id;

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("company_id")
    .eq("id", userId)
    .single();

  if (profileError) return res.status(400).json({ error: "User profile not found" });

  const { data, error } = await supabase
    .from("review_cycles")
    .select("*")
    .eq("company_id", profile.company_id)
    .order("start_date", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json(data);
});

// PATCH /api/v1/review-cycles/:id/status
router.patch("/:id/status", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["draft", "active", "completed", "archived"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  const { data, error } = await supabase
    .from("review_cycles")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json(data);
});

export default router;
