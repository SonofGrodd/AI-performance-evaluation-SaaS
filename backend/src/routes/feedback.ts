import express from "express";
import { authenticateUser } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

/**
 * POST /api/v1/feedback
 * Manager-only: Create feedback for an employee
 */
router.post(
  "/",
  authenticateUser,
  requireRole(["manager"]),
  async (req, res) => {
    const { employee_id, review_cycle_id, content, sentiment_label } = req.body;

    const { data, error } = await supabase.from("feedback").insert([
      {
        employee_id,
        review_cycle_id,
        content,
        sentiment_label,
      },
    ]).select().single();

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json(data);
  }
);

/**
 * GET /api/v1/feedback
 * Manager-only: Get all feedback with filters and pagination
 */
router.get(
  "/",
  authenticateUser,
  requireRole(["manager"]),
  async (req, res) => {
    const { employee_id, sentiment_label, review_cycle_id, limit = 10, offset = 0 } = req.query;

    let query = supabase
      .from("feedback")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (employee_id) query = query.eq("employee_id", employee_id);
    if (sentiment_label) query = query.eq("sentiment_label", sentiment_label);
    if (review_cycle_id) query = query.eq("review_cycle_id", review_cycle_id);

    const { data, error, count } = await query;

    if (error) return res.status(500).json({ error: error.message });

    res.json({ data, count });
  }
);

/**
 * PUT /api/v1/feedback/:id
 * Manager-only: Update feedback by ID
 */
router.put(
  "/:id",
  authenticateUser,
  requireRole(["manager"]),
  async (req, res) => {
    const { id } = req.params;
    const { content, sentiment_label } = req.body;

    const { data, error } = await supabase
      .from("feedback")
      .update({ content, sentiment_label })
      .eq("id", id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
  }
);

/**
 * DELETE /api/v1/feedback/:id
 * Manager-only: Delete feedback by ID
 */
router.delete(
  "/:id",
  authenticateUser,
  requireRole(["manager"]),
  async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase
      .from("feedback")
      .delete()
      .eq("id", id);

    if (error) return res.status(400).json({ error: error.message });

    res.status(204).send();
  }
);

export default router;
