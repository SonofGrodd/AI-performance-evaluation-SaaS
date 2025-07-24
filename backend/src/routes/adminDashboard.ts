import express from "express";
import { authenticateUser } from "../middleware/auth";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

// GET /api/v1/admin/dashboard
router.get("/", authenticateUser, async (req, res) => {
  const userId = res.locals.user.id;

  // Fetch the user's profile to get the company_id
  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("company_id, role")
    .eq("id", userId)
    .single();

  if (profileError || !profile || profile.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const { company_id } = profile;

  // Attendance summary
  const { data: attendance } = await supabase
    .from("attendance")
    .select("status, count:status")
    .eq("company_id", company_id)
    .group("status");

  const attendanceStats = attendance?.reduce((acc, row) => {
    acc[row.status] = row.count;
    return acc;
  }, {} as Record<string, number>);

  // Review status summary
  const { data: reviewStatus } = await supabase
    .from("performance_reviews")
    .select("status, count:status")
    .eq("company_id", company_id)
    .group("status");

  const reviewStats = reviewStatus?.reduce((acc, row) => {
    acc[row.status] = row.count;
    return acc;
  }, {} as Record<string, number>);

  // Sentiment summary
  const { data: sentiments } = await supabase
    .from("feedback")
    .select("sentiment_label")
    .eq("company_id", company_id);

  const sentimentSummary = sentiments?.reduce(
    (acc, f) => {
      if (["positive", "neutral", "negative"].includes(f.sentiment_label)) {
        acc[f.sentiment_label as "positive" | "neutral" | "negative"] += 1;
      }
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );

  // Flagged feedback & active alerts
  const { data: flaggedFeedback } = await supabase
    .from("feedback")
    .select("*")
    .eq("company_id", company_id)
    .eq("is_flagged", true);

  const { data: aiAlerts } = await supabase
    .from("ai_insights")
    .select("*")
    .eq("company_id", company_id)
    .eq("is_active", true);

  return res.json({
    attendanceStats,
    reviewStats,
    sentimentSummary,
    flaggedFeedback,
    aiAlerts,
  });
});

export default router;
