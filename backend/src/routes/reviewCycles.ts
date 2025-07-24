import express from "express";
import { supabase } from "../utils/supabaseClient";
import { authenticateUser } from "../middleware/auth";
import requireRole from "../middleware/roles";

const router = express.Router();

// POST /api/v1/review-cycles
router.post("/", authenticateUser, requireRole("manager"), async (req, res) => {
  const { name, start_date, end_date, status, company_id } = req.body;

  const { data, error } = await supabase
    .from("review_cycles")
    .insert([{ name, start_date, end_date, status, company_id }])
    .select()
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json(data);
});

// GET /api/v1/review-cycles
router.get("/", authenticateUser, requireRole("manager"), async (req, res) => {
  const { company_id } = req.query;

  const { data, error } = await supabase
    .from("review_cycles")
    .select("*")
    .eq("company_id", company_id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// PUT /api/v1/review-cycles/:id
router.put("/:id", authenticateUser, requireRole("manager"), async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const { data, error } = await supabase
    .from("review_cycles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(data);
});

// DELETE /api/v1/review-cycles/:id
router.delete("/:id", authenticateUser, requireRole("manager"), async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("review_cycles")
    .delete()
    .eq("id", id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(204).send();
});

export default router;
