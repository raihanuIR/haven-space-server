import express from 'express';
import {
  submitContactMessage,
  getContactMessages,
  updateContactStatus,
} from '../controllers/contactController.js';
import { verifyJWT, verifyAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Public: Submit contact inquiry
router.post('/', submitContactMessage);

// Admin: Get all inquiries & update status
router.get('/', verifyJWT, verifyAdmin, getContactMessages);
router.patch('/:id/status', verifyJWT, verifyAdmin, updateContactStatus);

export default router;
