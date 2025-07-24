import express from "express";
import { authenticateUser } from "../middleware/auth";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

// GET /api/v1/charts/employee-summary
router.get("/employee-summary", authenticateUser, async (req, res) => {
  const userId = res.locals.user.id;

  // Fetch last 5 performance reviews
  const { data: reviews } = await supabase
    .from("performance_reviews")
    .select("created_at, overall_score, goals_score, skills_score, collaboration_score, communication_score")
    .eq("employee_id", userId)
    .order("created_at", { ascending: true })
    .limit(5);

  // Fetch sentiment feedback
  const { data: feedbacks } = await supabase
    .from("feedback")
    .select("sentiment_label")
    .eq("employee_id", userId);

  const sentimentCount = feedbacks?.reduce(
    (acc, item) => {
      if (["positive", "neutral", "negative"].includes(item.sentiment_label)) {
        acc[item.sentiment_label as "positive" | "neutral" | "negative"] += 1;
      }
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );

  res.json({
    reviewTrends: reviews,
    sentimentDistribution: sentimentCount,
  });
});

// GET /api/v1/charts/team-summary
router.get("/team-summary", authenticateUser, async (req, res) => {
  const managerId = res.locals.user.id;

  const { data: teamMembers } = await supabase
    .from("user_profiles")
    .select("id")
    .eq("manager_id", managerId);

  const teamIds = teamMembers?.map((u) => u.id);

  if (!teamIds || teamIds.length === 0) {
    return res.json({ message: "No team members" });
  }

  // Review status breakdown
  const { data: reviews } = await supabase
    .from("performance_reviews")
    .select("status")
    .in("employee_id", teamIds);

  const statusSummary = reviews?.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Team-wide sentiment distribution
  const { data: feedbacks } = await supabase
    .from("feedback")
    .select("sentiment_label")
    .in("employee_id", teamIds);

  const sentimentCount = feedbacks?.reduce(
    (acc, f) => {
      if (["positive", "neutral", "negative"].includes(f.sentiment_label)) {
        acc[f.sentiment_label as "positive" | "neutral" | "negative"] += 1;
      }
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );

  res.json({
    teamReviewStatus: statusSummary,
    teamSentimentDistribution: sentimentCount,
  });
});

export default router;
