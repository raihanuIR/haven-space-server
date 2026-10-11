import express from 'express';
import {
  getFeaturedProperties,
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  getPlatformStats,
  getRelatedProperties,
} from '../controllers/propertyController.js';
import { verifyJWT, verifyOwner } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.get('/featured', getFeaturedProperties);
router.get('/stats/summary', getPlatformStats);
router.get('/', getAllProperties);

// Owner route to see own properties (including rejected with feedback)
router.get('/my-properties', verifyJWT, verifyOwner, getMyProperties);

// Related properties (Public)
router.get('/:id/related', getRelatedProperties);

// Property details (Public per Remontada specification)
router.get('/:id', getPropertyById);

// Owner create property
router.post('/', verifyJWT, verifyOwner, createProperty);

// Update & Delete property (Owner or Admin)
router.put('/:id', verifyJWT, updateProperty);
router.delete('/:id', verifyJWT, deleteProperty);

export default router;
