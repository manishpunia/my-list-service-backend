import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import userListRoutes from './routes/userListRoutes';

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json()); // Allows us to get data in req.body

// Define Routes
app.use('/api/my-list', userListRoutes);

app.get('/', (req, res) => {
  res.send('My List Service API');
});

export default app; // Export app for testing