import express from "express";
import { authenticateUser } from "../middleware/auth";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

// GET /api/v1/admin/charts/sentiment
router.get("/charts/sentiment", authenticateUser, async (req, res) => {
  const userId = res.locals.user.id;

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("company_id")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    return res.status(404).json({ error: "Admin profile not found" });
  }

  const { data: feedbacks } = await supabase
    .from("feedback")
    .select("sentiment_label")
    .eq("company_id", profile.company_id);

  const summary = { positive: 0, neutral: 0, negative: 0 };

  feedbacks?.forEach(f => {
    if (["positive", "neutral", "negative"].includes(f.sentiment_label)) {
      summary[f.sentiment_label as "positive" | "neutral" | "negative"] += 1;
    }
  });

  res.json(summary);
});

// GET /api/v1/admin/charts/reviews
router.get("/charts/reviews", authenticateUser, async (req, res) => {
  const userId = res.locals.user.id;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("company_id")
    .eq("id", userId)
    .single();

  const { data: reviews } = await supabase
    .from("performance_reviews")
    .select("status")
    .eq("company_id", profile?.company_id);

  const result: Record<string, number> = {};

  reviews?.forEach(r => {
    result[r.status] = (result[r.status] || 0) + 1;
  });

  res.json(result);
});

// GET /api/v1/admin/charts/attendance
router.get("/charts/attendance", authenticateUser, async (req, res) => {
  const userId = res.locals.user.id;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("company_id")
    .eq("id", userId)
    .single();

  const { data: attendance } = await supabase
    .from("attendance_logs")
    .select("clock_in_time")
    .eq("company_id", profile?.company_id);

  const dailySummary: Record<string, number> = {};

  attendance?.forEach((entry) => {
    const day = new Date(entry.clock_in_time).toISOString().split("T")[0];
    dailySummary[day] = (dailySummary[day] || 0) + 1;
  });

  res.json(dailySummary);
});

export default router;
  