import User from '../models/User.js';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import Transaction from '../models/Transaction.js';

// 1. Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.json({ success: true, count: users.length, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Change user role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['Tenant', 'Owner', 'Admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role provided' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = role;
    await user.save();

    return res.json({
      success: true,
      message: `User role successfully changed to ${role}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Get all properties (for Admin moderation)
export const getAllAdminProperties = async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    return res.json({ success: true, count: properties.length, properties });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Moderate property: Approve or Reject (with rejection feedback)
export const moderateProperty = async (req, res) => {
  try {
    const { status, rejectionFeedback } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be 'Approved' or 'Rejected'" });
    }

    if (status === 'Rejected' && (!rejectionFeedback || rejectionFeedback.trim() === '')) {
      return res.status(400).json({ success: false, message: 'Rejection feedback is required when rejecting a property' });
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    property.status = status;
    if (status === 'Rejected') {
      property.rejectionFeedback = rejectionFeedback.trim();
    } else {
      property.rejectionFeedback = ''; // clear previous rejection feedback if approved
    }

    await property.save();

    return res.json({
      success: true,
      message: `Property has been ${status.toLowerCase()}`,
      property,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Get all bookings with pagination
export const getAllBookings = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
    const skip = (page - 1) * limit;

    const total = await Booking.countDocuments();
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      bookings,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Get all transactions with pagination
export const getAllTransactions = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
    const skip = (page - 1) * limit;

    const total = await Transaction.countDocuments();
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      transactions,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
