import mongoose from 'mongoose';
import Review from '../models/Review.js';
import { mockReviews } from '../utils/mockStore.js';

export const addReview = async (req, res) => {
  try {
    const { propertyId, rating, comment } = req.body;
    if (!propertyId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Missing review fields' });
    }

    if (mongoose.connection.readyState === 1) {
      const review = await Review.create({
        propertyId,
        tenantId: req.user._id,
        name: req.user.name,
        email: req.user.email,
        photo: req.user.photo || '',
        rating: Number(rating),
        comment: comment.trim(),
      });
      return res.status(201).json({ success: true, message: 'Review added', review });
    }

    const review = {
      _id: `rev_${Date.now()}`,
      propertyId,
      tenantId: req.user._id,
      name: req.user.name,
      email: req.user.email,
      photo: req.user.photo || '',
      rating: Number(rating),
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };
    mockReviews.unshift(review);
    return res.status(201).json({ success: true, message: 'Review added', review });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPropertyReviews = async (req, res) => {
  try {
    const rawPropId = req.params.propertyId ? String(req.params.propertyId).trim() : '';

    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(rawPropId)) {
      const reviews = await Review.find({ propertyId: rawPropId }).sort({ createdAt: -1 });
      return res.json({ success: true, reviews: reviews || [] });
    }

    const reviews = mockReviews.filter((r) => r.propertyId === rawPropId);
    return res.json({ success: true, reviews: reviews || [] });
  } catch (error) {
    const rawPropId = req.params.propertyId ? String(req.params.propertyId).trim() : '';
    const reviews = mockReviews.filter((r) => r.propertyId === rawPropId);
    return res.json({ success: true, reviews: reviews || [] });
  }
};

export const getFeaturedReviews = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const reviews = await Review.find({ rating: { $gte: 4 } }).sort({ createdAt: -1 }).limit(6);
      return res.json({ success: true, reviews });
    }

    const reviews = mockReviews.filter((r) => r.rating >= 4).slice(0, 6);
    return res.json({ success: true, reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
