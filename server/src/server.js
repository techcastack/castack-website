import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { logger } from './config/logger.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';

// Load environment variables
dotenv.config();

// Resolve paths for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize database connection
connectDB();

const app = express();

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false, // Allows downloading uploaded resumes
}));

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173', // Vite local development port
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Request parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging HTTP Requests in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Apply Global Rate Limiting
app.use('/api', globalLimiter);

// Serve uploads directory securely (in admin controller downloading is preferred, 
// but static path is declared for safety)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root Health Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date(), uptime: process.uptime() });
});

// Map API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/inquiries', inquiryRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

// Define Server Port
const PORT = process.env.PORT || 5000;

// Launch Express Server
const server = app.listen(PORT, () => {
  logger.info(`Castack Server running in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
