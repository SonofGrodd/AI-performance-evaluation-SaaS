import express from "express";
import { authenticateUser } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

/**
 * GET /api/v1/third-party/metrics
 * Manager-only: Fetch 3rd-party evaluation metrics for employees in the manager's company
 */
router.get(
  "/metrics",
  authenticateUser,
  requireRole(["manager"]),
  async (req, res) => {
    const { id: userId } = res.locals.user;

    // 🔍 Fetch the manager's company_id
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("company_id")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: "Manager profile not found" });
    }

    const { company_id } = profile;

    // 📊 Query 3rd-party metrics for employees in this company
    const { data, error } = await supabase
      .from("third_party_metrics")
      .select("*")
      .eq("company_id", company_id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: "3rd-party metrics retrieved", data });
  }
);

export default router;
