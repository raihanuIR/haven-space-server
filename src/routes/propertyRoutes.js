import express from 'express';
import {
  getFeaturedProperties,
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
} from '../controllers/propertyController.js';
import { verifyJWT, verifyOwner } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.get('/featured', getFeaturedProperties);
router.get('/', getAllProperties);

// Owner route to see own properties (including rejected with feedback)
router.get('/my-properties', verifyJWT, verifyOwner, getMyProperties);

// Property details (Private route as specified in assignment)
router.get('/:id', verifyJWT, getPropertyById);

// Owner create property
router.post('/', verifyJWT, verifyOwner, createProperty);

// Update & Delete property (Owner or Admin)
router.put('/:id', verifyJWT, updateProperty);
router.delete('/:id', verifyJWT, deleteProperty);

export default router;
