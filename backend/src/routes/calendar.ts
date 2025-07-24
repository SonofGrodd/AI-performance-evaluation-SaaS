import express from "express";
import { authenticateUser } from "../middleware/auth";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

// GET /api/v1/calendar/events
router.get("/events", authenticateUser, async (req, res) => {
  const userId = res.locals.user.id;

  // Fetch attendance logs
  const { data: attendanceLogs } = await supabase
    .from("attendance_logs")
    .select("date, clock_in, clock_out");

  // Fetch review cycles (active or upcoming)
  const { data: reviewCycles } = await supabase
    .from("review_cycles")
    .select("start_date, end_date, name")
    .or("status.eq.active,status.eq.draft");

  // Fetch personal performance reviews
  const { data: myReviews } = await supabase
    .from("performance_reviews")
    .select("created_at, review_type, status")
    .eq("employee_id", userId);

  // Map everything to calendar events
  const attendanceEvents = attendanceLogs?.map(log => ({
    title: "Clock-in / Clock-out",
    start: log.clock_in,
    end: log.clock_out,
    type: "attendance"
  }));

  const reviewCycleEvents = reviewCycles?.map(cycle => ({
    title: `Review Cycle: ${cycle.name}`,
    start: cycle.start_date,
    end: cycle.end_date,
    type: "review_cycle"
  }));

  const personalReviewEvents = myReviews?.map(r => ({
    title: `Review: ${r.review_type} (${r.status})`,
    start: r.created_at,
    type: "review"
  }));

  const allEvents = [
    ...(attendanceEvents || []),
    ...(reviewCycleEvents || []),
    ...(personalReviewEvents || [])
  ];

  res.json({ events: allEvents });
});

export default router;
