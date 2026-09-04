import Property from '../models/Property.js';

// 1. Featured properties: Show 6 approved properties using MongoDB .limit(6)
export const getFeaturedProperties = async (req, res) => {
  try {
    const featured = await Property.find({ status: 'Approved' })
      .sort({ createdAt: -1 })
      .limit(6);

    return res.json({
      success: true,
      count: featured.length,
      properties: featured,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. All Properties: Backend search, filters, sorting, and pagination
export const getAllProperties = async (req, res) => {
  try {
    const { location, propertyType, minPrice, maxPrice, sort, page = 1, limit = 6 } = req.query;

    const query = { status: 'Approved' };

    // Backend search by location
    if (location && location.trim() !== '') {
      query.location = { $regex: location.trim(), $options: 'i' };
    }

    // Backend filter by property type
    if (propertyType && propertyType !== 'All') {
      query.propertyType = propertyType;
    }

    // Price range filters
    if (minPrice || maxPrice) {
      query.rentPrice = {};
      if (minPrice) query.rentPrice.$gte = Number(minPrice);
      if (maxPrice) query.rentPrice.$lte = Number(maxPrice);
    }

    // Sorting options: Price Low to High, Price High to Low, Newest
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') {
      sortOption = { rentPrice: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { rentPrice: -1 };
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 6);
    const skip = (pageNum - 1) * limitNum;

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    return res.json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      limit: limitNum,
      properties,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Single property details
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
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
      return res.status(400).json({ success: false, message: 'Please provide all required fields and at least one image' });
    }

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
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Update property (Owner or Admin)
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Check ownership or admin
    if (
      req.user.role !== 'Admin' &&
      property.owner.ownerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this property' });
    }

    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    return res.json({
      success: true,
      message: 'Property updated successfully',
      property: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Delete property (Owner or Admin)
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (
      req.user.role !== 'Admin' &&
      property.owner.ownerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this property' });
    }

    await Property.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 7. Get Owner's Properties (includes Pending, Approved, Rejected + rejectionFeedback)
export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ 'owner.ownerId': req.user._id }).sort({ createdAt: -1 });
    return res.json({
      success: true,
      properties,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
