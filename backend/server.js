import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/database.js';

// Import routes
import organizerRoutes from './routes/organizers.js';
import volunteerRoutes from './routes/volunteers.js';
import contributionRoutes from './routes/contributions.js';

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/organizers', organizerRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/contributions', contributionRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'AlgoVerse Log Track API',
    version: '1.0.0',
    description: 'MongoDB backend for AlgoVerse volunteer contribution tracking system',
    endpoints: {
      organizers: '/api/organizers',
      volunteers: '/api/volunteers',
      contributions: '/api/contributions',
      health: '/health'
    },
    documentation: {
      organizers: {
        'GET /api/organizers': 'List all organizers',
        'GET /api/organizers/:walletAddress': 'Get organizer by wallet address',
        'POST /api/organizers': 'Register new organizer',
        'PUT /api/organizers/:walletAddress': 'Update organizer',
        'PUT /api/organizers/:walletAddress/verify': 'Update verification status',
        'DELETE /api/organizers/:walletAddress': 'Deactivate organizer'
      },
      volunteers: {
        'GET /api/volunteers': 'List volunteers with filtering',
        'GET /api/volunteers/:walletAddress': 'Get volunteer by wallet address',
        'POST /api/volunteers': 'Register new volunteer',
        'POST /api/volunteers/search': 'Advanced volunteer search',
        'PUT /api/volunteers/:walletAddress': 'Update volunteer profile',
        'PUT /api/volunteers/:walletAddress/verify': 'Update verification status',
        'PUT /api/volunteers/:walletAddress/stats': 'Update statistics',
        'DELETE /api/volunteers/:walletAddress': 'Deactivate volunteer'
      },
      contributions: {
        'GET /api/contributions': 'List contributions with filtering',
        'GET /api/contributions/:id': 'Get contribution by ID',
        'POST /api/contributions': 'Create new contribution',
        'PUT /api/contributions/:id': 'Update contribution',
        'PUT /api/contributions/:id/verify': 'Verify contribution',
        'PUT /api/contributions/:id/blockchain': 'Update blockchain status',
        'GET /api/contributions/stats/summary': 'Get contribution statistics',
        'DELETE /api/contributions/:id': 'Soft delete contribution'
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: ['/api', '/health', '/api/organizers', '/api/volunteers', '/api/contributions']
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global Error Handler:', error);
  
  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }

  // Duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }

  // JWT errors (when authentication is implemented)
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // Default server error
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
🚀 AlgoVerse Log Track API Server Started
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
📚 API Docs: http://localhost:${PORT}/api
❤️  Health: http://localhost:${PORT}/health
  `);
});

export default app;