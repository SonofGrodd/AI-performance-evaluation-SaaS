import express from "express";
import { authenticateUser } from "../middleware/auth";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

// POST /api/v1/integrations/performance-metrics
router.post("/performance-metrics", authenticateUser, async (req, res) => {
  const employeeId = res.locals.user.id;
  const {
    metric_name,
    metric_value,
    metric_unit,
    metric_type,
    source_system,
    metadata,
  } = req.body;

  const { error } = await supabase.from("performance_metrics").insert([
    {
      employee_id: employeeId,
      metric_name,
      metric_value,
      metric_unit,
      metric_type,
      source_system,
      metadata,
    },
  ]);

  if (error) return res.status(500).json({ error: error.message });

  return res.status(201).json({ message: "Performance metric logged" });
});

export default router;
