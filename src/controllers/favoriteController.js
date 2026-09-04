import mongoose from 'mongoose';
import Favorite from '../models/Favorite.js';
import Property from '../models/Property.js';
import { mockFavorites, mockProperties } from '../utils/mockStore.js';

export const addFavorite = async (req, res) => {
  try {
    const { propertyId } = req.body;

    if (mongoose.connection.readyState === 1) {
      const property = await Property.findById(propertyId);
      if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
      const existing = await Favorite.findOne({ userId: req.user._id, propertyId });
      if (existing) return res.status(400).json({ success: false, message: 'Property already in favorites' });
      const favorite = await Favorite.create({ userId: req.user._id, propertyId });
      return res.status(201).json({ success: true, message: 'Added to favorites', favorite });
    }

    const existing = mockFavorites.find(
      (f) => f.userId === req.user._id && (f.propertyId?._id === propertyId || f.propertyId === propertyId)
    );
    if (existing) return res.status(400).json({ success: false, message: 'Property already in favorites' });

    const property = mockProperties.find((p) => p._id === propertyId);
    const favorite = {
      _id: `fav_${Date.now()}`,
      userId: req.user._id,
      propertyId: property || propertyId,
      createdAt: new Date().toISOString(),
    };
    mockFavorites.push(favorite);
    return res.status(201).json({ success: true, message: 'Added to favorites', favorite });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      await Favorite.findOneAndDelete({
        userId: req.user._id,
        $or: [{ _id: id }, { propertyId: id }],
      });
      return res.json({ success: true, message: 'Removed from favorites' });
    }

    const idx = mockFavorites.findIndex(
      (f) => f.userId === req.user._id && (f._id === id || f.propertyId?._id === id || f.propertyId === id)
    );
    if (idx !== -1) mockFavorites.splice(idx, 1);
    return res.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyFavorites = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const favorites = await Favorite.find({ userId: req.user._id }).populate('propertyId').sort({ createdAt: -1 });
      return res.json({ success: true, favorites });
    }

    const favorites = mockFavorites.filter((f) => f.userId === req.user._id);
    return res.json({ success: true, favorites });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
