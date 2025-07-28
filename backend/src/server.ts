import express from 'express';
import usersRouter from './routes/users';
import cors from 'cors';


// … other imports …

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,                 
}));

app.options('*', cors());
app.use(express.json());
app.use('/api/v1/users', usersRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});



