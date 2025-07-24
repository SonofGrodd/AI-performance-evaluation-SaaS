import express from "express";
import { authenticateUser } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

// POST /api/v1/companies - Only managers can create
router.post("/", authenticateUser, requireRole(["manager"]), async (req, res) => {
  const { name, domain } = req.body;
  const user = res.locals.user;

  const { data, error } = await supabase
    .from("companies")
    .insert([{ name, domain, owner_id: user.id }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// GET /api/v1/companies/:id - Manager or Employee can access
router.get("/:id", authenticateUser, requireRole(["manager", "employee"]), async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return res.status(404).json({ error: "Company not found" });
  res.json(data);
});

// PUT /api/v1/companies/:id - Only managers
router.put("/:id", authenticateUser, requireRole(["manager"]), async (req, res) => {
  const { id } = req.params;
  const { name, domain } = req.body;

  const { data, error } = await supabase
    .from("companies")
    .update({ name, domain })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// DELETE /api/v1/companies/:id - Only managers
router.delete("/:id", authenticateUser, requireRole(["manager"]), async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("companies")
    .delete()
    .eq("id", id);

  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

export default router;
