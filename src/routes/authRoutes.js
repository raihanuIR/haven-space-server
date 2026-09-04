import express from 'express';
import {
  registerUser,
  loginUser,
  googleAuth,
  getMe,
  updateProfile,
} from '../controllers/authController.js';
import { verifyJWT } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.get('/me', verifyJWT, getMe);
router.put('/profile', verifyJWT, updateProfile);

export default router;
