import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import usersRouter from './routes/users';
import cors from 'cors';
import authRouter from './routes/auth';

// … other imports …

const app = express();
// 1) Enable CORS for your front‑end origin
app.use(cors({
  origin: 'http://localhost:5173',    // your React/Vite dev server
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,                  // if you ever use cookies/auth headers
}));



// 3) Your existing middleware
app.use(express.json());
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);

// … your existing route mounting (auth/login, companies, etc.) …

// Finally, start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
