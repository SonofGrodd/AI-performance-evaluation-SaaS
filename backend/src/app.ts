// backend/src/app.ts
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
import feedbackRoutes from "./routes/feedback";

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// API routes
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
