import express from 'express';
import {
  createBooking,
  getMyBookings,
  getOwnerBookingRequests,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { verifyJWT, verifyOwner } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', verifyJWT, createBooking);
router.get('/my-bookings', verifyJWT, getMyBookings);
router.get('/owner-requests', verifyJWT, verifyOwner, getOwnerBookingRequests);
router.patch('/:id/status', verifyJWT, updateBookingStatus);

export default router;
