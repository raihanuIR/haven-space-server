import express from 'express';
import { getOwnerAnalytics } from '../controllers/ownerController.js';
import { verifyJWT, verifyOwner } from '../middlewares/auth.js';

const router = express.Router();

router.get('/analytics', verifyJWT, verifyOwner, getOwnerAnalytics);

export default router;
