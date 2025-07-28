
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv';
import userRoutes from './routes/users';
import companyRoutes from './routes/companies'
import departmentRoutes from './routes/departments'
import authRoutes from './routes/auth'
import reviewCycleRoutes from "./routes/reviewCycles"
import performanceReviewRoutes from "./routes/performanceReviews"
import feedbackRoutes from "./routes/feedback"
import metricsRoutes from "./routes/performanceMetrics"
import aiInsightsRoutes from "./routes/aiInsights"
import peerReviewsRoutes from "./routes/peerReviews"
import aiChatRoutes from "./routes/aiChat"
import chartsRoutes from "./routes/charts"
import integrationRoutes from "./routes/integrations"
import attendanceRoutes from "./routes/attendance"
import calendarRoutes from "./routes/calendar"
import adminAnalyticsRoutes from "./routes/adminAnalytics"
import adminDashboardRoutes from "./routes/adminDashboard"
import notificationRoutes from "./routes/notifications"
import adminAttendanceRoutes from "./routes/adminAttendance"
import reportRoutes from "./routes/reports"
import thirdPartyRoutes from "./routes/thirdParty"
import skillTestsRoutes from "./routes/skillTests"
import behavioralAnalysisRoutes from "./routes/behavioralAnalysis"
import threeSixtyRoutes from "./routes/threeSixtyReviews";


dotenv.config()

const app = express()

// Middleware
app.use("/api/v1/behavioral-analysis", behavioralAnalysisRoutes);
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // if you're using cookies or tokens
  })
);
;
app.use(morgan('dev'))
app.use(express.json({ limit: "1mb" }));


// API routes
app.use("/api/v1/three-sixty-reviews", threeSixtyRoutes);
app.use("/api/v1/skill-tests", skillTestsRoutes); 
app.use("/api/v1/third-party", thirdPartyRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1/admin", adminAttendanceRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/admin/dashboard", adminDashboardRoutes);
app.use("/api/v1/admin", adminAnalyticsRoutes);
app.use("/api/v1/calendar", calendarRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/integrations", integrationRoutes);
app.use("/api/v1/charts", chartsRoutes);
app.use("/api/v1/ai", aiChatRoutes);
app.use("/api/v1/peer-reviews", peerReviewsRoutes);
app.use("/api/v1/ai-insights", aiInsightsRoutes);
app.use("/api/v1/performance-metrics", metricsRoutes);
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/performance-reviews", performanceReviewRoutes);
app.use("/api/v1/review-cycles", reviewCycleRoutes);
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/companies', companyRoutes)
app.use('/api/v1/departments', departmentRoutes)
// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'AI Performance API is running 🚀' })
})

export default app
