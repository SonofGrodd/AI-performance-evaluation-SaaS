// src/routes/skillTests.ts

import express from "express";
import { authenticateUser } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import { supabase } from "../utils/supabaseClient";

const router = express.Router();

/**
 * POST /api/v1/skill-tests
 * Manager-only: Create a new skill test
 */
router.post("/", authenticateUser, requireRole(["manager"]), async (req, res) => {
  const { title, description } = req.body;
  const { id: userId } = res.locals.user;

  const { data: managerProfile, error: profileError } = await supabase
    .from("user_profiles")
    .select("company_id")
    .eq("id", userId)
    .single();

  if (profileError || !managerProfile) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const { company_id } = managerProfile;

  const { data, error } = await supabase
    .from("skill_tests")
    .insert([{ title, description, created_by: userId, company_id }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

/**
 * GET /api/v1/skill-tests
 * Manager-only: Get all skill tests for their company
 */
router.get("/", authenticateUser, requireRole(["manager"]), async (req, res) => {
  const { id: userId } = res.locals.user;

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("company_id")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const { data, error } = await supabase
    .from("skill_tests")
    .select("*")
    .eq("company_id", profile.company_id);

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

/**
 * POST /api/v1/skill-tests/:id/assign
 * Manager-only: Assign a skill test to an employee
 */
router.post("/:id/assign", authenticateUser, requireRole(["manager"]), async (req, res) => {
  const { id: testId } = req.params;
  const { employee_id, due_date } = req.body;
  const { id: assigned_by } = res.locals.user;

  const { data, error } = await supabase
    .from("test_assignments")
    .insert([{ employee_id, test_id: testId, due_date, assigned_by }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

/**
 * GET /api/v1/skill-tests/assigned
 * Employee-only: Get all tests assigned to the logged-in employee
 */
router.get("/assigned", authenticateUser, requireRole(["employee"]), async (req, res) => {
  const { id: employee_id } = res.locals.user;

  const { data, error } = await supabase
    .from("test_assignments")
    .select("*, skill_tests(title, description)")
    .eq("employee_id", employee_id);

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

/**
 * POST /api/v1/skill-tests/:id/submit
 * Employee-only: Submit test result
 */
router.post("/:id/submit", authenticateUser, requireRole(["employee"]), async (req, res) => {
  const { id: test_id } = req.params;
  const { answers, score } = req.body;
  const { id: employee_id } = res.locals.user;

  const { data, error } = await supabase
    .from("test_results")
    .insert([{ employee_id, test_id, answers, score }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

/**
 * GET /api/v1/skill-tests/results
 * Employee-only: View all submitted test results
 */
router.get("/results", authenticateUser, requireRole(["employee"]), async (req, res) => {
  const { id: employee_id } = res.locals.user;

  const { data, error } = await supabase
    .from("test_results")
    .select("*, skill_tests(title)")
    .eq("employee_id", employee_id);

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export default router;
