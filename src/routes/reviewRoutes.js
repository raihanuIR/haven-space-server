import express from 'express';
import {
  addReview,
  getPropertyReviews,
  getFeaturedReviews,
} from '../controllers/reviewController.js';
import { verifyJWT } from '../middlewares/auth.js';

const router = express.Router();

router.get('/featured', getFeaturedReviews);
router.get('/property/:propertyId', getPropertyReviews);
router.post('/', verifyJWT, addReview);

export default router;
