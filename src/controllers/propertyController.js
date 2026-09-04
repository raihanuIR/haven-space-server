import mongoose from 'mongoose';
import Property from '../models/Property.js';
import { mockProperties } from '../utils/mockStore.js';

// 1. Featured properties: Show 6 approved properties
export const getFeaturedProperties = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const featured = await Property.find({ status: 'Approved' })
        .sort({ createdAt: -1 })
        .limit(6);
      return res.json({ success: true, count: featured.length, properties: featured });
    }

    // In-memory fallback: 6 approved properties
    const featured = mockProperties
      .filter((p) => p.status === 'Approved')
      .slice(0, 6);

    return res.json({ success: true, count: featured.length, properties: featured });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. All Properties: Backend search, filters, sorting, and pagination
export const getAllProperties = async (req, res) => {
  try {
    const { location, propertyType, minPrice, maxPrice, sort, page = 1, limit = 6 } = req.query;

    if (mongoose.connection.readyState === 1) {
      const query = { status: 'Approved' };
      if (location && location.trim() !== '') {
        query.location = { $regex: location.trim(), $options: 'i' };
      }
      if (propertyType && propertyType !== 'All') {
        query.propertyType = propertyType;
      }
      if (minPrice || maxPrice) {
        query.rentPrice = {};
        if (minPrice) query.rentPrice.$gte = Number(minPrice);
        if (maxPrice) query.rentPrice.$lte = Number(maxPrice);
      }

      let sortOption = { createdAt: -1 };
      if (sort === 'price_asc') sortOption = { rentPrice: 1 };
      else if (sort === 'price_desc') sortOption = { rentPrice: -1 };

      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 6);
      const skip = (pageNum - 1) * limitNum;

      const total = await Property.countDocuments(query);
      const properties = await Property.find(query).sort(sortOption).skip(skip).limit(limitNum);

      return res.json({
        success: true,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
        limit: limitNum,
        properties,
      });
    }

    // In-memory fallback
    let filtered = mockProperties.filter((p) => p.status === 'Approved');

    if (location && location.trim() !== '') {
      const loc = location.trim().toLowerCase();
      filtered = filtered.filter(
        (p) => p.location.toLowerCase().includes(loc) || p.title.toLowerCase().includes(loc)
      );
    }

    if (propertyType && propertyType !== 'All') {
      filtered = filtered.filter((p) => p.propertyType === propertyType);
    }

    if (minPrice) {
      filtered = filtered.filter((p) => p.rentPrice >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((p) => p.rentPrice <= Number(maxPrice));
    }

    if (sort === 'price_asc') {
      filtered.sort((a, b) => a.rentPrice - b.rentPrice);
    } else if (sort === 'price_desc') {
      filtered.sort((a, b) => b.rentPrice - a.rentPrice);
    } else {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 6);
    const total = filtered.length;
    const paginated = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    return res.json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      limit: limitNum,
      properties: paginated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Single property details
export const getPropertyById = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const property = await Property.findById(req.params.id);
      if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
      return res.json({ success: true, property });
    }

    // In-memory fallback
    const property = mockProperties.find((p) => p._id === req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    return res.json({ success: true, property });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Create property (Owner action - defaults to Pending)
export const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      propertyType,
      rentPrice,
      rentType,
      bedrooms,
      bathrooms,
      propertySize,
      amenities,
      images,
      extraFeatures,
    } = req.body;

    if (!title || !description || !location || !rentPrice || !images || images.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (mongoose.connection.readyState === 1) {
      const newProperty = await Property.create({
        title,
        description,
        location,
        propertyType: propertyType || 'Apartment',
        rentPrice: Number(rentPrice),
        rentType: rentType || 'Monthly',
        bedrooms: Number(bedrooms) || 1,
        bathrooms: Number(bathrooms) || 1,
        propertySize: Number(propertySize) || 500,
        amenities: Array.isArray(amenities) ? amenities : [],
        images: Array.isArray(images) ? images : [images],
        extraFeatures: extraFeatures || '',
        status: 'Pending',
        owner: {
          ownerId: req.user._id,
          name: req.user.name,
          email: req.user.email,
          phone: req.body.ownerPhone || '',
        },
      });

      return res.status(201).json({
        success: true,
        message: 'Property submitted successfully! Waiting for admin approval.',
        property: newProperty,
      });
    }

    // In-memory fallback
    const newProperty = {
      _id: `prop_${Date.now()}`,
      title,
      description,
      location,
      propertyType: propertyType || 'Apartment',
      rentPrice: Number(rentPrice),
      rentType: rentType || 'Monthly',
      bedrooms: Number(bedrooms) || 1,
      bathrooms: Number(bathrooms) || 1,
      propertySize: Number(propertySize) || 500,
      amenities: Array.isArray(amenities) ? amenities : [],
      images: Array.isArray(images) ? images : [images],
      extraFeatures: extraFeatures || '',
      status: 'Pending',
      rejectionFeedback: '',
      owner: {
        ownerId: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.body.ownerPhone || '',
      },
      createdAt: new Date().toISOString(),
    };
    mockProperties.unshift(newProperty);

    return res.status(201).json({
      success: true,
      message: 'Property submitted successfully! Waiting for admin approval.',
      property: newProperty,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Update property
export const updateProperty = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const property = await Property.findById(req.params.id);
      if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
      const updated = await Property.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });
      return res.json({ success: true, message: 'Property updated', property: updated });
    }

    const idx = mockProperties.findIndex((p) => p._id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Property not found' });
    mockProperties[idx] = { ...mockProperties[idx], ...req.body };
    return res.json({ success: true, message: 'Property updated', property: mockProperties[idx] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Delete property
export const deleteProperty = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Property.findByIdAndDelete(req.params.id);
      return res.json({ success: true, message: 'Property deleted successfully' });
    }

    const idx = mockProperties.findIndex((p) => p._id === req.params.id);
    if (idx !== -1) mockProperties.splice(idx, 1);
    return res.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 7. Get Owner's Properties (with rejection feedback)
export const getMyProperties = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const properties = await Property.find({ 'owner.ownerId': req.user._id }).sort({ createdAt: -1 });
      return res.json({ success: true, properties });
    }

    // In-memory fallback
    const properties = mockProperties.filter(
      (p) => p.owner.ownerId === req.user._id || p.owner.email === req.user.email
    );
    return res.json({ success: true, properties });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
