// src/routes/adminDashboard.ts
import express from "express";
import { authenticateUser } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

/**
 * GET /api/v1/admin-dashboard/overview
 * Manager-only: Overview analytics
 */
router.get(
  "/overview",
  authenticateUser,
  requireRole(["manager"]),
  async (req, res) => {
    const { id: userId } = res.locals.user;

    // Get manager's company
    const { data: managerProfile, error: profileError } = await supabase
      .from("user_profiles")
      .select("company_id")
      .eq("id", userId)
      .single();

    if (profileError || !managerProfile) {
      return res.status(404).json({ error: "Manager profile not found" });
    }

    const { company_id } = managerProfile;

    // Review stats
    const { data: reviewStats, error: reviewError } = await supabase.rpc(
      "get_review_status_counts_by_company",
      { input_company_id: company_id }
    );

    // Sentiment stats
    const { data: sentimentStats, error: sentimentError } = await supabase.rpc(
      "get_sentiment_counts_by_company",
      { input_company_id: company_id }
    );

    if (reviewError || sentimentError) {
      return res.status(500).json({ error: "Failed to load stats" });
    }

    res.json({
      reviewStats,
      sentimentStats,
    });
  }
);

export default router;
