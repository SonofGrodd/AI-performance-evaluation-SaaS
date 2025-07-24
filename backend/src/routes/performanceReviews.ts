import express from "express";
import { authenticateUser } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

// POST /api/v1/performance-reviews - Manager only
router.post("/", authenticateUser, requireRole(["manager"]), async (req, res) => {
  const { employee_id, review_cycle_id, reviewer_id, ratings, comments, status } = req.body;

  const { data, error } = await supabase
    .from("performance_reviews")
    .insert([{ employee_id, review_cycle_id, reviewer_id, ratings, comments, status }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// GET /api/v1/performance-reviews/:employee_id - Employee or Manager
router.get("/:employee_id", authenticateUser, requireRole(["manager", "employee"]), async (req, res) => {
  const { employee_id } = req.params;

  const { data, error } = await supabase
    .from("performance_reviews")
    .select("*")
    .eq("employee_id", employee_id)
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// PUT /api/v1/performance-reviews/:id - Manager only
router.put("/:id", authenticateUser, requireRole(["manager"]), async (req, res) => {
  const { id } = req.params;
  const { ratings, comments, status } = req.body;

  const { data, error } = await supabase
    .from("performance_reviews")
    .update({ ratings, comments, status })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// DELETE /api/v1/performance-reviews/:id - Manager only
router.delete("/:id", authenticateUser, requireRole(["manager"]), async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("performance_reviews")
    .delete()
    .eq("id", id);

  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

export default router;
