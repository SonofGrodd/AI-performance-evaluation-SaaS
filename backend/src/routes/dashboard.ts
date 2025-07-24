import express from "express";
import { authenticateUser } from "../middleware/auth";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

// GET /api/v1/dashboard/employee
router.get("/employee", authenticateUser, async (req, res) => {
  const userId = res.locals.user.id;

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("id, company_id, first_name, last_name, department, job_title")
    .eq("id", userId)
    .single();

  if (profileError || !profile) return res.status(404).json({ error: "User profile not found" });

  const { id, company_id } = profile;

  // Get current active review cycle
  const { data: currentCycle } = await supabase
    .from("review_cycles")
    .select("*")
    .eq("company_id", company_id)
    .eq("status", "active")
    .order("start_date", { ascending: false })
    .limit(1)
    .single();

  // Get most recent review
  const { data: review } = await supabase
    .from("performance_reviews")
    .select("*")
    .eq("employee_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // Feedback sentiment summary
  const { data: feedbackList } = await supabase
    .from("feedback")
    .select("sentiment_label")
    .eq("employee_id", id);

  const sentimentSummary = feedbackList?.reduce(
    (acc, f) => {
      if (f.sentiment_label) acc[f.sentiment_label] += 1;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );

  // Latest AI insights
  const { data: insights } = await supabase
    .from("ai_insights")
    .select("*")
    .eq("employee_id", id)
    .eq("is_active", true);

  res.json({
    profile,
    currentCycle,
    latestReview: review,
    sentimentSummary,
    aiInsights: insights,
  });
});

// GET /api/v1/dashboard/manager
router.get("/manager", authenticateUser, async (req, res) => {
  const userId = res.locals.user.id;

  // Get all team members
  const { data: team } = await supabase
    .from("user_profiles")
    .select("id, first_name, last_name, department")
    .eq("manager_id", userId);

  const teamIds = team?.map(member => member.id);

  if (!team || team.length === 0) {
 return res.json({ message: "No team members found", team: [], stats: {} });
  }

  // Review stats
  const { data: reviews } = await supabase
    .from("performance_reviews")
    .select("status");
 
  const reviewStats = reviews?.reduce(
    (acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Sentiment breakdown
  const { data: feedbacks } = await supabase
    .from("feedback")
    .select("sentiment_label");
 
  const sentimentSummary = feedbacks?.reduce(
    (acc, f) => {
      if (f.sentiment_label) acc[f.sentiment_label as keyof typeof acc] += 1;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );

  // Flagged AI insights
  const { data: alerts } = await supabase
    .from("ai_insights")
    .select("*")
    .in("employee_id", teamIds as string[])
    .eq("is_active", true);

  res.json({
    team,
    reviewStats,
    sentimentSummary,
    aiInsights: alerts,
  });
});

export default router;
