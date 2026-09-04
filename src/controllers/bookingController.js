import Booking from '../models/Booking.js';
import Property from '../models/Property.js';
import Transaction from '../models/Transaction.js';

// 1. Create booking (Tenant action)
export const createBooking = async (req, res) => {
  try {
    const {
      propertyId,
      moveInDate,
      contactNumber,
      additionalNotes,
      amountPaid,
      stripeSessionId,
      paymentIntentId,
    } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const booking = await Booking.create({
      propertyId: property._id,
      propertyName: property.title,
      propertyImage: property.images[0] || '',
      propertyLocation: property.location,
      tenantId: req.user._id,
      tenantName: req.user.name,
      tenantEmail: req.user.email,
      ownerId: property.owner.ownerId,
      ownerEmail: property.owner.email,
      moveInDate: new Date(moveInDate),
      contactNumber,
      additionalNotes: additionalNotes || '',
      amountPaid: Number(amountPaid) || property.rentPrice,
      bookingStatus: 'Pending',
      paymentStatus: 'Paid',
      stripeSessionId: stripeSessionId || '',
      paymentIntentId: paymentIntentId || `mock_pi_${Date.now()}`,
    });

    // Create corresponding transaction record
    await Transaction.create({
      transactionId: paymentIntentId || `TXN_${Date.now()}`,
      bookingId: booking._id,
      propertyId: property._id,
      propertyName: property.title,
      tenantId: req.user._id,
      tenantName: req.user.name,
      tenantEmail: req.user.email,
      ownerId: property.owner.ownerId,
      ownerName: property.owner.name,
      ownerEmail: property.owner.email,
      amount: booking.amountPaid,
    });

    return res.status(201).json({
      success: true,
      message: 'Booking placed successfully!',
      booking,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get currently logged-in tenant's bookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ tenantId: req.user._id }).sort({ createdAt: -1 });
    return res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Get owner's incoming booking requests
export const getOwnerBookingRequests = async (req, res) => {
  try {
    const requests = await Booking.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
    return res.json({
      success: true,
      requests,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Update booking status (Owner action: Approve / Reject)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be Approved or Rejected' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Verify user is owner of property or admin
    if (
      req.user.role !== 'Admin' &&
      booking.ownerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to manage this booking' });
    }

    booking.bookingStatus = status;
    await booking.save();

    return res.json({
      success: true,
      message: `Booking has been ${status.toLowerCase()}`,
      booking,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
