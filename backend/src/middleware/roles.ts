import express from "express";
import { authenticateUser } from "./auth";
import { requireRole } from "./roles";

const router = express.Router();

router.get( 
  "/admin/dashboard",
  authenticateUser,
  requireRole(["manager", "admin"]),
  (req, res) => {
    res.json({ message: "Welcome, Admin or Manager!" });
  }
);

router.get(
  "/employee/profile",
  authenticateUser,
  requireRole(["employee"]),
  (req, res) => {
    res.json({ message: "Hello, Employee!" });
  }
);

export default router;
