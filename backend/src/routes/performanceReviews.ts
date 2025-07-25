import express from "express";
import { authenticateUser } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

/**
 * Manager-only: Create a new performance review
 * POST /api/v1/performance-reviews
 */
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

/**
 * Shared route: Get reviews for a specific employee
 * GET /api/v1/performance-reviews/:employee_id
 */
router.get(
  "/:employee_id",
  authenticateUser,
  requireRole(["manager", "employee"]),
  async (req, res) => {
    const { employee_id } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const { data, error, count } = await supabase
      .from("performance_reviews")
      .select("*", { count: "exact" })
      .eq("employee_id", employee_id)
      .order("created_at", { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ data, count });
  }
);

/**
 * Manager-only: Get all reviews with optional filters
 * GET /api/v1/performance-reviews?status=&employee_id=&limit=&offset=
 */
router.get(
  "/",
  authenticateUser,
  requireRole(["manager"]),
  async (req, res) => {
    const { status, employee_id, limit = 10, offset = 0 } = req.query;

    let query = supabase
      .from("performance_reviews")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (status) query = query.eq("status", status);
    if (employee_id) query = query.eq("employee_id", employee_id);

    const { data, error, count } = await query;

    if (error) return res.status(500).json({ error: error.message });

    res.json({ data, count });
  }
);

/**
 * Manager-only: Update review
 * PUT /api/v1/performance-reviews/:id
 */
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

/**
 * Manager-only: Delete review
 * DELETE /api/v1/performance-reviews/:id
 */
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
