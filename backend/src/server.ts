import express from 'express';
import usersRouter from './routes/users';
// … other imports …

const app = express();

// … your existing middleware (CORS, JSON parsing, auth middleware, etc.) …

// Mount your users routes under /api/v1/users
app.use('/api/v1/users', usersRouter);

// … your existing route mounting (auth/login, companies, etc.) …

// Finally, start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
