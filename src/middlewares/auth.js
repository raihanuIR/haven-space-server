import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { mockUsers } from '../utils/mockStore.js';

export const verifyJWT = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'property_rental_jwt_secret_key_secure_2026'
      );

      // If MongoDB is connected, query DB
      if (mongoose.connection.readyState === 1) {
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
          return res.status(401).json({ success: false, message: 'User not found' });
        }
        req.user = user;
        return next();
      }

      // In-Memory Fallback
      const user = mockUsers.find((u) => u._id === decoded.id);
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }
      req.user = user;
      return next();
    } catch (error) {
      console.error('[Auth Middleware Error]:', error.message);
      return res.status(401).json({ success: false, message: 'Invalid or expired authentication token' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No authentication token provided' });
  }
};

export const verifyRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Requires [${roles.join(', ')}] role. Current role is '${req.user?.role}'`,
      });
    }
    next();
  };
};

export const verifyTenant = verifyRole('Tenant', 'Admin');
export const verifyOwner = verifyRole('Owner', 'Admin');
export const verifyAdmin = verifyRole('Admin');
