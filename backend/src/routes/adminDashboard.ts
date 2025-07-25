import express from "express";
import { authenticateUser } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

/**
 * GET /api/v1/admin-dashboard/stats
 * Manager-only: Get overall company performance stats
 */
router.get(
  "/stats",
  authenticateUser,
  requireRole(["manager"]),
  async (req, res) => {
    const userId = res.locals.user.id;

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

    // Aggregate performance reviews for this company
    const { data: reviewStats, error: reviewError } = await supabase
      .from("performance_reviews")
      .select("status, count:id")
      .eq("company_id", company_id)
      .group("status");

    // Aggregate feedback sentiments
    const { data: sentimentStats, error: sentimentError } = await supabase
      .from("feedback")
      .select("sentiment_label, count:id")
      .eq("company_id", company_id)
      .group("sentiment_label");

    if (reviewError || sentimentError) {
      return res.status(500).json({
        error: reviewError?.message || sentimentError?.message,
      });
    }

    res.json({
      reviewStats,
      sentimentStats,
    });
  }
);

export default router;
