import express from "express";
import { authenticateUser } from "../middleware/auth";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

// POST /api/v1/performance-reviews
router.post("/", authenticateUser, async (req, res) => {
  const reviewer_id = res.locals.user.id;
  const {
    employee_id,
    cycle_id,
    review_type,
    overall_score,
    goals_score,
    skills_score,
    collaboration_score,
    communication_score,
    strengths,
    areas_for_improvement,
    goals_next_period,
    manager_comments,
    employee_comments,
    status = "draft"
  } = req.body;

  if (!employee_id || !cycle_id || !review_type) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const { data, error } = await supabase
    .from("performance_reviews")
    .insert([
      {
        employee_id,
        reviewer_id,
        cycle_id,
        review_type,
        overall_score,
        goals_score,
        skills_score,
        collaboration_score,
        communication_score,
        strengths,
        areas_for_improvement,
        goals_next_period,
        manager_comments,
        employee_comments,
        status
      }
    ])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json(data);
});

// GET /api/v1/performance-reviews
router.get("/", authenticateUser, async (req, res) => {
  const userId = res.locals.user.id;

  const { data, error } = await supabase
    .from("performance_reviews")
    .select("*")
    .or(`employee_id.eq.${userId},reviewer_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json(data);
});

// PUT /api/v1/performance-reviews/:id
router.put("/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body, updated_at: new Date().toISOString() };

  const { data, error } = await supabase
    .from("performance_reviews")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json(data);
});

// DELETE /api/v1/performance-reviews/:id
router.delete("/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("performance_reviews")
    .delete()
    .eq("id", id);

  if (error) return res.status(400).json({ error: error.message });

  res.status(204).send();
});

export default router;
