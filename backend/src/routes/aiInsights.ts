import express from "express";
import { authenticateUser } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

/**
 * GET /api/v1/ai-insights
 * Manager-only: Get all active AI insights for their company with filters & pagination
 */
router.get(
  "/",
  authenticateUser,
  requireRole(["manager"]),
  async (req, res) => {
    const { limit = 10, offset = 0, employee_id, is_active = true } = req.query;
    const { id: userId } = res.locals.user;

    // Get manager's company ID
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("company_id")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: "Manager profile not found" });
    }

    const { company_id } = profile;

    let query = supabase
      .from("ai_insights")
      .select("*", { count: "exact" })
      .eq("company_id", company_id)
      .order("created_at", { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (employee_id) query = query.eq("employee_id", employee_id);
    if (is_active !== undefined) query = query.eq("is_active", is_active === "true");

    const { data, error, count } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ data, count });
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

    const { data, error } = await supabase
      .from("ai_insights")
      .insert([
        {
          employee_id,
          summary,
          sentiment_score,
          recommendations,
          is_active: true,
        },
      ])
      .select()
      .single();

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
