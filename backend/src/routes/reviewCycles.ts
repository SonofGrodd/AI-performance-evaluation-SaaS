import express from "express";
import { authenticateUser } from "../middleware/auth";
import { requireRole } from "../middleware/roles"; // ✅ fixed
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

// GET all review cycles for a company (manager only)
router.get("/", authenticateUser, requireRole("manager"), async (req, res) => {
  const { company_id } = res.locals.user;

  const { data, error } = await supabase
    .from("review_cycles")
    .select("*")
    .eq("company_id", company_id);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST create a new review cycle (manager only)
router.post("/", authenticateUser, requireRole("manager"), async (req, res) => {
  const { name, start_date, end_date } = req.body;
  const { company_id } = res.locals.user;

  const { data, error } = await supabase.from("review_cycles").insert([
    {
      name,
      start_date,
      end_date,
      status: "active",
      company_id,
    },
  ]);

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// PUT update a review cycle by ID (manager only)
router.put("/:id", authenticateUser, requireRole("manager"), async (req, res) => {
  const { id } = req.params;
  const { name, start_date, end_date, status } = req.body;
  const { company_id } = res.locals.user;

  const { data, error } = await supabase
    .from("review_cycles")
    .update({ name, start_date, end_date, status })
    .eq("id", id)
    .eq("company_id", company_id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// DELETE a review cycle by ID (manager only)
router.delete("/:id", authenticateUser, requireRole("manager"), async (req, res) => {
  const { id } = req.params;
  const { company_id } = res.locals.user;

  const { error } = await supabase
    .from("review_cycles")
    .delete()
    .eq("id", id)
    .eq("company_id", company_id);

  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

export default router;
