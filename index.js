import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import { seedDatabase } from './src/utils/seedData.js';

import authRoutes from './src/routes/authRoutes.js';
import propertyRoutes from './src/routes/propertyRoutes.js';
import bookingRoutes from './src/routes/bookingRoutes.js';
import reviewRoutes from './src/routes/reviewRoutes.js';
import favoriteRoutes from './src/routes/favoriteRoutes.js';
import ownerRoutes from './src/routes/ownerRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import paymentRoutes from './src/routes/paymentRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(() => {
  seedDatabase();
});

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());

// Base health check
app.get('/', (req, res) => {
  res.json({
    name: 'Property Rental & Booking Platform API',
    status: 'Online',
    version: '1.0.0',
    documentation: '/api/properties',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`[Server] Running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
