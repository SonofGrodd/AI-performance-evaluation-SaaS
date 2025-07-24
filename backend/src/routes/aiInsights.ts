import express from "express";
import { authenticateUser } from "../middleware/auth";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

// POST /api/v1/ai-insights
router.post("/", authenticateUser, async (req, res) => {
  const { employee_id, insight_type, insight_data, confidence_score, model_version = "v1.0" } = req.body;

  if (!employee_id || !insight_type || !insight_data || confidence_score == null) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const { data, error } = await supabase.from("ai_insights").insert([
    {
      employee_id,
      insight_type,
      insight_data,
      confidence_score,
      model_version,
    },
  ])
  .select()
  .single();

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json(data);
});

// GET /api/v1/ai-insights/:employee_id
router.get("/:employee_id", authenticateUser, async (req, res) => {
  const { employee_id } = req.params;

  const { data, error } = await supabase
    .from("ai_insights")
    .select("*")
    .eq("employee_id", employee_id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json(data);
});

export default router;
