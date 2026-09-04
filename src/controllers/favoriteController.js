import Favorite from '../models/Favorite.js';
import Property from '../models/Property.js';

// 1. Add property to user's favorites
export const addFavorite = async (req, res) => {
  try {
    const { propertyId } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const existing = await Favorite.findOne({ userId: req.user._id, propertyId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Property already in favorites' });
    }

    const favorite = await Favorite.create({
      userId: req.user._id,
      propertyId,
    });

    return res.status(201).json({
      success: true,
      message: 'Property added to favorites!',
      favorite,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Remove property from user's favorites
export const removeFavorite = async (req, res) => {
  try {
    const { id } = req.params; // Can be favorite _id or propertyId
    await Favorite.findOneAndDelete({
      userId: req.user._id,
      $or: [{ _id: id }, { propertyId: id }],
    });

    return res.json({
      success: true,
      message: 'Removed from favorites',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Get user's favorites with populated property data
export const getMyFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id })
      .populate('propertyId')
      .sort({ createdAt: -1 });

    // Filter out any where property may have been deleted
    const validFavorites = favorites.filter(fav => fav.propertyId !== null);

    return res.json({
      success: true,
      favorites: validFavorites,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
