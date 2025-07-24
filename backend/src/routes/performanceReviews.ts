import express from "express";
import { authenticateUser } from "../middleware/auth";
import { supabase } from "../utils/supabaseClient";
import { sendEmail } from "../utils/sendEmail";

const router = express.Router();

// POST /api/v1/performance-reviews
router.post("/", authenticateUser, async (req, res) => {
  const reviewerId = res.locals.user.id;
  const {
    employee_id,
    cycle_id,
    review_type,
    overall_score,
    goals_score,
    skills_score,
    collaboration_score,
    communication_score,
    strengths,
    areas_for_improvement,
    goals_next_period,
    manager_comments,
    employee_comments,
  } = req.body;

  // 1. Insert the performance review
  const { data: review, error } = await supabase
    .from("performance_reviews")
    .insert([
      {
        employee_id,
        reviewer_id: reviewerId,
        cycle_id,
        review_type,
        overall_score,
        goals_score,
        skills_score,
        collaboration_score,
        communication_score,
        strengths,
        areas_for_improvement,
        goals_next_period,
        manager_comments,
        employee_comments,
      },
    ])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  // 2. Fetch employee profile
  const { data: employeeProfile, error: profileError } = await supabase
    .from("user_profiles")
    .select("first_name, last_name")
    .eq("id", employee_id)
    .single();

  if (profileError || !employeeProfile) {
    console.warn("Employee profile not found for email notification.");
    return res.status(201).json({ review, warning: "Profile not found for email." });
  }

  // 3. Get email via Supabase Admin API
  const { data: authUser } = await supabase.auth.admin.getUserById(employee_id);
  const employeeEmail = authUser?.user?.email;

  if (employeeEmail) {
    const fullName = `${employeeProfile.first_name} ${employeeProfile.last_name}`;
    try {
      await sendEmail(
        employeeEmail,
        "📋 New Performance Review Assigned",
        `<p>Hi ${fullName},<br /><br />You have a new performance review assigned. Please complete it before the deadline.</p>`
      );
    } catch (err) {
      console.error("❌ Failed to send review email:", err);
    }
  }

  return res.status(201).json({ review });
});

export default router;
