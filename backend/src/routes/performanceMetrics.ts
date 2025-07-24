import express from "express";
import { supabase } from "../utils/supabaseClient";
import { authenticateUser } from "../middleware/auth";
import { requireRole } from "../middleware/roles";

const router = express.Router();

/**
 * GET /api/v1/performance-metrics
 * Manager-only: Get all performance metrics for their company
 */
router.get(
  "/",
  authenticateUser,
  requireRole(["manager"]),
  async (req, res) => {
    const { id: userId } = res.locals.user;

    // Get manager's company_id
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("company_id")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: "Manager profile not found" });
    }

    const { company_id } = profile;

    const { data, error } = await supabase
      .from("performance_metrics")
      .select("*")
      .eq("company_id", company_id);

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  }
);

/**
 * POST /api/v1/performance-metrics
 * Manager-only: Create a new performance metric
 */
router.post(
  "/",
  authenticateUser,
  requireRole(["manager"]),
  async (req, res) => {
    const { name, description } = req.body;
    const { id: userId } = res.locals.user;

    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("company_id")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: "Manager profile not found" });
    }

    const { company_id } = profile;

    const { data, error } = await supabase.from("performance_metrics").insert([
      {
        name,
        description,
        company_id,
      },
    ]);

    if (error) return res.status(500).json({ error: error.message });

    res.status(201).json({ message: "Metric created", data });
  }
);

/**
 * PUT /api/v1/performance-metrics/:id
 * Manager-only: Update a metric
 */
router.put(
  "/:id",
  authenticateUser,
  requireRole(["manager"]),
  async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    const { error } = await supabase
      .from("performance_metrics")
      .update({ name, description })
      .eq("id", id);

    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: "Metric updated" });
  }
);

/**
 * DELETE /api/v1/performance-metrics/:id
 * Manager-only: Delete a metric
 */
router.delete(
  "/:id",
  authenticateUser,
  requireRole(["manager"]),
  async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase
      .from("performance_metrics")
      .delete()
      .eq("id", id);

    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: "Metric deleted" });
  }
);

export default router;
