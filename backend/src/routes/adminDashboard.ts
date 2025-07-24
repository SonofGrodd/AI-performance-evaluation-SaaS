import express from "express";
import { authenticateUser } from "../middleware/auth";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

// GET /api/v1/admin/dashboard
router.get("/", authenticateUser, async (req, res) => {
  const userId = res.locals.user.id;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("company_id, role")
    .eq("id", userId)
    .single();

  if (!profile || !["admin", "hr"].includes(profile.role)) {
    return res.status(403).json({ error: "Access denied" });
  }

  const companyId = profile.company_id;

  const [{ count: employeeCount }, { count: managerCount }, { data: reviews }, { data: feedback }] = await Promise.all([
    supabase.from("user_profiles").select("*", { count: "exact", head: true }).eq("company_id", companyId).eq("role", "employee"),
    supabase.from("user_profiles").select("*", { count: "exact", head: true }).eq("company_id", companyId).eq("role", "manager"),
    supabase.from("performance_reviews").select("status").eq("company_id", companyId),
    supabase.from("feedback").select("sentiment_label").eq("employee_id", "inferred"), // covered by RLS
  ]);

  const reviewStatusCount = reviews?.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sentimentBreakdown = feedback?.reduce((acc, f) => {
    if (["positive", "neutral", "negative"].includes(f.sentiment_label)) {
      acc[f.sentiment_label as "positive" | "neutral" | "negative"] += 1;
    }
    return acc;
  }, { positive: 0, neutral: 0, negative: 0 });

  res.json({
    employeeCount,
    managerCount,
    reviewStatusCount,
    sentimentBreakdown,
  });
});

export default router;
