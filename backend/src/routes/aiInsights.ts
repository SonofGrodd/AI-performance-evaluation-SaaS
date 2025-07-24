import express from "express";
import { authenticateUser } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

/**
 * GET /api/v1/ai-insights
 * Manager-only: Get all active AI insights for their company
 */
router.get(
  "/",
  authenticateUser,
  requireRole(["manager"]),
  async (req, res) => {
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

    const { data, error } = await supabase
      .from("ai_insights")
      .select("*")
      .eq("company_id", company_id)
      .eq("is_active", true);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  }
);

/**
 * GET /api/v1/ai-insights/:employeeId
 * Employee can view their own insights; manager can view anyone's
 */
router.get(
  "/:employeeId",
  authenticateUser,
  requireRole(["employee", "manager"]),
  async (req, res) => {
    const user = res.locals.user;
    const { employeeId } = req.params;

    if (user.role === "employee" && user.id !== employeeId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const { data, error } = await supabase
      .from("ai_insights")
      .select("*")
      .eq("employee_id", employeeId)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ insights: data });
  }
);

/**
 * POST /api/v1/ai-insights
 * Manager-only: Create new AI insight for an employee
 */
router.post(
  "/",
  authenticateUser,
  requireRole(["manager"]),
  async (req, res) => {
    const { employee_id, summary, sentiment_score, recommendations } = req.body;

    const { data, error } = await supabase.from("ai_insights").insert([
      {
        employee_id,
        summary,
        sentiment_score,
        recommendations,
        is_active: true,
      },
    ]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ message: "Insight created", data });
  }
);

/**
 * PUT /api/v1/ai-insights/:id/deactivate
 * Manager-only: Deactivate an AI insight
 */
router.put(
  "/:id/deactivate",
  authenticateUser,
  requireRole(["manager"]),
  async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase
      .from("ai_insights")
      .update({ is_active: false })
      .eq("id", id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: "Insight deactivated" });
  }
);

export default router;
