// src/routes/reports.ts
import express from "express";
import PDFDocument from "pdfkit";
import { supabase } from "../utils/supabaseClient";
import { authenticateUser } from "../middleware/auth";
import { format } from "date-fns";
import { stringify } from "fast-csv";

const router = express.Router();

// GET /api/v1/reports/export/pdf?type=reviews
router.get("/export/pdf", authenticateUser, async (req, res) => {
  const { type } = req.query;
  const userId = res.locals.user.id;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("company_id")
    .eq("id", userId)
    .single();

  if (!profile) return res.status(404).json({ error: "Profile not found" });

  let records: any[] = [];

  if (type === "feedback") {
    const { data } = await supabase
      .from("feedback")
      .select("employee_id, message, sentiment_label, created_at")
      .eq("company_id", profile.company_id);
    records = data || [];
  } else {
    const { data } = await supabase
      .from("performance_reviews")
      .select("employee_id, reviewer_id, score, status, created_at")
      .eq("company_id", profile.company_id);
    records = data || [];
  }

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${type || "report"}-${Date.now()}.pdf`
  );

  doc.pipe(res);

  doc.fontSize(20).text(`${(type as string)?.toUpperCase()} REPORT`, { underline: true });
  doc.moveDown();

  records.forEach((r, idx) => {
    doc.fontSize(12).text(`#${idx + 1}`);
    Object.entries(r).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`);
    });
    doc.moveDown();
  });

  doc.end();
});

// GET /api/v1/reports/export/csv?type=feedback
router.get("/export/csv", authenticateUser, async (req, res) => {
  const { type } = req.query;
  const userId = res.locals.user.id;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("company_id")
    .eq("id", userId)
    .single();

  if (!profile) return res.status(404).json({ error: "Profile not found" });

  let records: any[] = [];

  if (type === "feedback") {
    const { data } = await supabase
      .from("feedback")
      .select("employee_id, message, sentiment_label, created_at")
      .eq("company_id", profile.company_id);
    records = data || [];
  } else {
    const { data } = await supabase
      .from("performance_reviews")
      .select("employee_id, reviewer_id, score, status, created_at")
      .eq("company_id", profile.company_id);
    records = data || [];
  }

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${type || "report"}-${Date.now()}.csv`
  );

  stringify(records, { headers: true }).pipe(res);
});

export default router;
