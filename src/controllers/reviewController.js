import Review from '../models/Review.js';

// 1. Post review for property
export const addReview = async (req, res) => {
  try {
    const { propertyId, rating, comment } = req.body;

    if (!propertyId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Property, rating and comment are required' });
    }

    const review = await Review.create({
      propertyId,
      tenantId: req.user._id,
      name: req.user.name,
      email: req.user.email,
      photo: req.user.photo || '',
      rating: Number(rating),
      comment: comment.trim(),
    });

    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get reviews for a specific property
export const getPropertyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ propertyId: req.params.propertyId }).sort({ createdAt: -1 });
    return res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Get featured reviews for Home Page customer reviews section
export const getFeaturedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ rating: { $gte: 4 } })
      .sort({ createdAt: -1 })
      .limit(6);

    return res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
