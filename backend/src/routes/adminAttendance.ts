import express from "express";
import { authenticateUser } from "../middleware/auth";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

// GET /api/v1/admin/attendance
router.get("/attendance", authenticateUser, async (req, res) => {
  const userId = res.locals.user.id;

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("company_id, role")
    .eq("id", userId)
    .single();

  if (profileError || !profile || profile.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const companyId = profile.company_id;

  // 1. Get all user clock logs in the company
  const { data: logs } = await supabase
    .from("clock_logs")
    .select("user_id, clock_in, clock_out")
    .eq("company_id", companyId);

  // 2. Group by user and compute lateness or absence
  const attendanceStats: Record<string, { totalDays: number; late: number; absent: number }> = {};

  logs?.forEach((log) => {
    const user = log.user_id;
    const clockIn = new Date(log.clock_in);
    const hour = clockIn.getUTCHours(); // or local timezone logic

    if (!attendanceStats[user]) {
      attendanceStats[user] = { totalDays: 0, late: 0, absent: 0 };
    }

    attendanceStats[user].totalDays += 1;

    if (hour > 9) {
      attendanceStats[user].late += 1;
    }

    if (!log.clock_in || !log.clock_out) {
      attendanceStats[user].absent += 1;
    }
  });

  // 3. Fetch leave requests
  const { data: leaves } = await supabase
    .from("leave_requests")
    .select("*")
    .eq("company_id", companyId)
    .eq("status", "approved");

  // 4. Fetch holiday calendar
  const { data: holidays } = await supabase
    .from("holidays")
    .select("*")
    .eq("company_id", companyId);

  res.json({
    attendanceStats,
    leaveRequests: leaves,
    holidayCalendar: holidays,
  });
});

export default router;
