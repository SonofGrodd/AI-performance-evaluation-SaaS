import express from "express";
import { authenticateUser } from "../middleware/auth";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

// POST /api/v1/performance-metrics
router.post("/", authenticateUser, async (req, res) => {
  const {
    employee_id,
    metric_name,
    metric_value,
    metric_unit,
    metric_type,
    source_system,
    metadata,
    recorded_at,
  } = req.body;

  if (!employee_id || !metric_name || !metric_value || !metric_type || !source_system) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const { data, error } = await supabase.from("performance_metrics").insert([
    {
      employee_id,
      metric_name,
      metric_value,
      metric_unit,
      metric_type,
      source_system,
      metadata,
      recorded_at: recorded_at || new Date().toISOString(),
    },
  ])
  .select()
  .single();

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json(data);
});

// GET /api/v1/performance-metrics/:employee_id
router.get("/:employee_id", authenticateUser, async (req, res) => {
  const { employee_id } = req.params;

  const { data, error } = await supabase
    .from("performance_metrics")
    .select("*")
    .eq("employee_id", employee_id)
    .order("recorded_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json(data);
});

export default router;
