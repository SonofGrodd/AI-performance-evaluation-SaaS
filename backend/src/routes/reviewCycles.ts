import express from "express";
import { authenticateUser } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

// POST /api/v1/review-cycles - Managers only
router.post("/", authenticateUser, requireRole(["manager"]), async (req, res) => {
  const { name, start_date, end_date, company_id } = req.body;

  const { data, error } = await supabase
    .from("review_cycles")
    .insert([{ name, start_date, end_date, status: "active", company_id }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// GET /api/v1/review-cycles/:company_id - Managers only
router.get("/:company_id", authenticateUser, requireRole(["manager"]), async (req, res) => {
  const { company_id } = req.params;

  const { data, error } = await supabase
    .from("review_cycles")
    .select("*")
    .eq("company_id", company_id)
    .order("start_date", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// PUT /api/v1/review-cycles/:id - Managers only
router.put("/:id", authenticateUser, requireRole(["manager"]), async (req, res) => {
  const { id } = req.params;
  const { name, start_date, end_date, status } = req.body;

  const { data, error } = await supabase
    .from("review_cycles")
    .update({ name, start_date, end_date, status })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// DELETE /api/v1/review-cycles/:id - Managers only
router.delete("/:id", authenticateUser, requireRole(["manager"]), async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("review_cycles")
    .delete()
    .eq("id", id);

  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

export default router;
