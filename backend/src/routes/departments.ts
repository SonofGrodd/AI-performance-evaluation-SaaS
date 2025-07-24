import express from "express";
import { authenticateUser } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

// POST /api/v1/departments - Only managers
router.post("/", authenticateUser, requireRole(["manager"]), async (req, res) => {
  const { name, company_id } = req.body;

  const { data, error } = await supabase
    .from("departments")
    .insert([{ name, company_id }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// GET /api/v1/departments/:id - Manager or employee
router.get("/:id", authenticateUser, requireRole(["manager", "employee"]), async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("departments")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return res.status(404).json({ error: "Department not found" });
  res.json(data);
});

// PUT /api/v1/departments/:id - Only managers
router.put("/:id", authenticateUser, requireRole(["manager"]), async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const { data, error } = await supabase
    .from("departments")
    .update({ name })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// DELETE /api/v1/departments/:id - Only managers
router.delete("/:id", authenticateUser, requireRole(["manager"]), async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("departments")
    .delete()
    .eq("id", id);

  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

export default router;
