import express from "express";
import { authenticateUser } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

/**
 * POST /api/v1/behavioral-analysis
 * Manager-only: Log behavioral traits for an employee
 */
router.post(
  "/",
  authenticateUser,
  requireRole(["manager"]),
  async (req, res) => {
    const { employee_id, review_cycle_id, traits, comments } = req.body;
    const { id: manager_id } = res.locals.user;

    const { data, error } = await supabase
      .from("behavioral_analysis")
      .insert([
        {
          employee_id,
          review_cycle_id,
          traits,
          comments,
          observed_by: manager_id,
        },
      ])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json(data);
  }
);

/**
 * GET /api/v1/behavioral-analysis/:employee_id
 * Manager-only: View behavioral logs for an employee
 */
router.get(
  "/:employee_id",
  authenticateUser,
  requireRole(["manager"]),
  async (req, res) => {
    const { employee_id } = req.params;

    const { data, error } = await supabase
      .from("behavioral_analysis")
      .select("*")
      .eq("employee_id", employee_id)
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  }
);

/**
 * DELETE /api/v1/behavioral-analysis/:id
 * Manager-only: Delete a behavioral entry
 */
router.delete(
  "/:id",
  authenticateUser,
  requireRole(["manager"]),
  async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase
      .from("behavioral_analysis")
      .delete()
      .eq("id", id);

    if (error) return res.status(500).json({ error: error.message });

    res.status(204).send();
  }
);

export default router;
