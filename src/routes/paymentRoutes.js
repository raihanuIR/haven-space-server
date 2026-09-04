import express from 'express';
import { createPaymentIntent } from '../controllers/paymentController.js';
import { verifyJWT } from '../middlewares/auth.js';

const router = express.Router();

router.post('/create-payment-intent', verifyJWT, createPaymentIntent);

export default router;
