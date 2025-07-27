// File: backend/src/routes/index.ts
import express from "express";

import authRoutes from "./auth";
import userRoutes from "./users";
import performanceReviewRoutes from "./performanceReviews";
import feedbackRoutes from "./feedback";
import aiInsightsRoutes from "./aiInsights";
import reviewCycleRoutes from "./reviewCycles";
import adminDashboardRoutes from "./adminDashboard";
import analyticsRoutes from "./dashboard"; // analytics
import reportsRoutes from "./reports";
import thirdPartyRoutes from "./thirdParty";
import behavioralRoutes from "./behavioralAnalysis";
import goalRoutes from "./goalTracking";
import recognitionRoutes from "./recognition";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/performance-reviews", performanceReviewRoutes);
router.use("/feedback", feedbackRoutes);
router.use("/ai-insights", aiInsightsRoutes);
router.use("/review-cycles", reviewCycleRoutes);
router.use("/admin-dashboard", adminDashboardRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/reports", reportsRoutes);
router.use("/third-party", thirdPartyRoutes);
router.use("/behavioral-analysis", behavioralRoutes);
router.use("/goal-tracking", goalRoutes);
router.use("/recognition", recognitionRoutes);

export default router;
