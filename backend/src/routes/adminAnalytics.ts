import express from "express";
import { authenticateUser } from "../middleware/auth";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

// GET /api/v1/admin/attendance-summary
router.get("/attendance-summary", authenticateUser, async (req, res) => {
  const userId = res.locals.user.id;

  // 1. Get current user's company_id
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("company_id")
    .eq("id", userId)
    .single();

  if (!profile) return res.status(404).json({ error: "Admin profile not found" });

  // 2. Fetch all attendance logs for the company
  const { data: logs, error } = await supabase
    .from("attendance_logs")
    .select("employee_id, clock_in, date")
    .eq("company_id", profile.company_id);

  if (error) return res.status(500).json({ error: error.message });

  // 3. Process attendance into metrics
  const summary: Record<string, { late: number; absent: number; averageTime?: string }> = {};

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const today = now.toISOString().split("T")[0];

  // Build set of present days by employee
  const logsByEmployee: Record<string, { dates: Set<string>; times: number[] }> = {};

  logs?.forEach(log => {
    const dateStr = new Date(log.date).toISOString().split("T")[0];
    if (!logsByEmployee[log.employee_id]) {
      logsByEmployee[log.employee_id] = { dates: new Set(), times: [] };
    }

    logsByEmployee[log.employee_id].dates.add(dateStr);

    if (log.clock_in) {
      const time = new Date(log.clock_in).getHours() + new Date(log.clock_in).getMinutes() / 60;
      logsByEmployee[log.employee_id].times.push(time);
    }
  });

  // Generate stats
  for (const [employeeId, data] of Object.entries(logsByEmployee)) {
    const workingDays = getWeekdaysInMonth(monthStart, now);
    const presentDays = data.dates.size;
    const absent = workingDays - presentDays;
    const late = data.times.filter(t => t > 9).length;

    const avgTime = data.times.length
      ? (data.times.reduce((a, b) => a + b, 0) / data.times.length).toFixed(2)
      : undefined;

    summary[employeeId] = {
      late,
      absent,
      averageTime: avgTime,
    };
  }

  res.json(summary);
});

// Utility: count weekdays
function getWeekdaysInMonth(start: Date, end: Date): number {
  let count = 0;
  const date = new Date(start);

  while (date <= end) {
    const day = date.getDay();
    if (day !== 0 && day !== 6) count++;
    date.setDate(date.getDate() + 1);
  }

  return count;
}

export default router;
