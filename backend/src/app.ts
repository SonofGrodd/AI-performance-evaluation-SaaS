// backend/src/app.ts
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'

import authRoutes from './routes/auth'

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// API routes
app.use('/api/v1/auth', authRoutes)

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'AI Performance API is running 🚀' })
})

export default app
