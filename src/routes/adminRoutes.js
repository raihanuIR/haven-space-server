import express from 'express';
import {
  getAllUsers,
  updateUserRole,
  getAllAdminProperties,
  moderateProperty,
  getAllBookings,
  getAllTransactions,
} from '../controllers/adminController.js';
import { verifyJWT, verifyAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.use(verifyJWT, verifyAdmin);

// Admin user management
router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);

// Admin property moderation
router.get('/properties', getAllAdminProperties);
router.patch('/properties/:id/moderate', moderateProperty);

// Admin monitoring
router.get('/bookings', getAllBookings);
router.get('/transactions', getAllTransactions);

export default router;
