import express from 'express';
import {
  addFavorite,
  removeFavorite,
  getMyFavorites,
} from '../controllers/favoriteController.js';
import { verifyJWT } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', verifyJWT, addFavorite);
router.get('/', verifyJWT, getMyFavorites);
router.delete('/:id', verifyJWT, removeFavorite);

export default router;
