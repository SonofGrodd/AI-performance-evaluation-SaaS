// src/routes/dashboard.ts
import express from "express";
import { authenticateUser } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

/*
 * GET /api/v1/dashboard/employee
 * Employee-only: View personal dashboard with latest review, feedback sentiment, and AI insights
 */
router.get(
  "/employee",
  authenticateUser,
  requireRole(["employee"]),
  async (req, res) => {
    const { id: userId } = res.locals.user;

    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("id, company_id, first_name, last_name, department, job_title")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: "User profile not found" });
    }

    const { id, company_id } = profile;

    const { data: currentCycle } = await supabase
      .from("review_cycles")
      .select("*")
      .eq("company_id", company_id)
      .eq("status", "active")
      .order("start_date", { ascending: false })
      .limit(1)
      .single();

    const { data: review } = await supabase
      .from("performance_reviews")
      .select("*")
      .eq("employee_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const { data: feedbackList } = await supabase
      .from("feedback")
      .select("sentiment_label")
      .eq("employee_id", id);

    const sentimentSummary = feedbackList?.reduce(
      (acc, f) => {
        if (["positive", "neutral", "negative"].includes(f.sentiment_label)) {
          acc[f.sentiment_label as "positive" | "neutral" | "negative"] += 1;
        }
        return acc;
      },
      { positive: 0, neutral: 0, negative: 0 }
    );

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
  }
);

/**
 * GET /api/v1/dashboard/manager
 * Manager-only: View team stats and alerts
 */
router.get(
  "/manager",
  authenticateUser,
  requireRole(["manager"]),
  async (req, res) => {
    const { id: userId } = res.locals.user;

    const { data: team, error: teamError } = await supabase
      .from("user_profiles")
      .select("id, first_name, last_name, department")
      .eq("manager_id", userId);

    if (teamError || !team || team.length === 0) {
      return res.json({
        message: "No team members found",
        team: [],
        reviewStats: {},
        sentimentSummary: {},
        aiInsights: [],
      });
    }

    const teamIds: string[] = team.map((member) => member.id);

    const { data: reviews } = await supabase
      .from("performance_reviews")
      .select("status")
      .in("employee_id", teamIds);

    const reviewStats = reviews?.reduce(
      (acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const { data: feedbacks } = await supabase
      .from("feedback")
      .select("sentiment_label")
      .in("employee_id", teamIds);

    const sentimentSummary = feedbacks?.reduce(
      (acc, f) => {
        if (["positive", "neutral", "negative"].includes(f.sentiment_label)) {
          acc[f.sentiment_label as "positive" | "neutral" | "negative"] += 1;
        }
        return acc;
      },
      { positive: 0, neutral: 0, negative: 0 }
    );

    const { data: alerts } = await supabase
      .from("ai_insights")
      .select("*")
      .in("employee_id", teamIds)
      .eq("is_active", true);

    res.json({
      team,
      reviewStats,
      sentimentSummary,
      aiInsights: alerts,
    });
  }
);

export default router;
