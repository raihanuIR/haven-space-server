import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Property from '../models/Property.js';
import Transaction from '../models/Transaction.js';
import { mockBookings, mockProperties, mockTransactions } from '../utils/mockStore.js';

export const createBooking = async (req, res) => {
  try {
    const {
      propertyId,
      moveInDate,
      contactNumber,
      additionalNotes,
      amountPaid,
      paymentIntentId,
    } = req.body;

    if (mongoose.connection.readyState === 1) {
      const property = await Property.findById(propertyId);
      if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

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
        paymentIntentId: paymentIntentId || `TXN_${Date.now()}`,
      });

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

      return res.status(201).json({ success: true, message: 'Booking placed successfully!', booking });
    }

    // In-Memory Fallback
    const property = mockProperties.find((p) => p._id === propertyId);
    const newBooking = {
      _id: `book_${Date.now()}`,
      propertyId: property ? property._id : propertyId,
      propertyName: property ? property.title : 'Prime Rental Residence',
      propertyImage: property ? property.images[0] : '',
      propertyLocation: property ? property.location : 'Downtown',
      tenantId: req.user._id,
      tenantName: req.user.name,
      tenantEmail: req.user.email,
      ownerId: property ? property.owner.ownerId : 'user_owner_001',
      ownerEmail: property ? property.owner.email : 'owner@rentalhub.com',
      moveInDate: new Date(moveInDate).toISOString(),
      contactNumber,
      additionalNotes: additionalNotes || '',
      amountPaid: Number(amountPaid) || (property ? property.rentPrice : 2500),
      bookingStatus: 'Pending',
      paymentStatus: 'Paid',
      paymentIntentId: paymentIntentId || `TXN_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    mockBookings.unshift(newBooking);

    mockTransactions.unshift({
      _id: `tx_${Date.now()}`,
      transactionId: paymentIntentId || `TXN_${Date.now()}`,
      bookingId: newBooking._id,
      propertyId: newBooking.propertyId,
      propertyName: newBooking.propertyName,
      tenantId: req.user._id,
      tenantName: req.user.name,
      tenantEmail: req.user.email,
      ownerId: newBooking.ownerId,
      ownerName: property ? property.owner.name : 'Michael Vance',
      ownerEmail: newBooking.ownerEmail,
      amount: newBooking.amountPaid,
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({ success: true, message: 'Booking placed successfully!', booking: newBooking });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const bookings = await Booking.find({ tenantId: req.user._id }).sort({ createdAt: -1 });
      return res.json({ success: true, bookings });
    }

    const bookings = mockBookings.filter(
      (b) => b.tenantId === req.user._id || b.tenantEmail === req.user.email
    );
    return res.json({ success: true, bookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getOwnerBookingRequests = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const requests = await Booking.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
      return res.json({ success: true, requests });
    }

    const requests = mockBookings.filter(
      (b) => b.ownerId === req.user._id || b.ownerEmail === req.user.email
    );
    return res.json({ success: true, requests });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (mongoose.connection.readyState === 1) {
      const booking = await Booking.findById(req.params.id);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
      booking.bookingStatus = status;
      await booking.save();
      return res.json({ success: true, message: `Booking has been ${status.toLowerCase()}`, booking });
    }

    const booking = mockBookings.find((b) => b._id === req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    booking.bookingStatus = status;
    return res.json({ success: true, message: `Booking has been ${status.toLowerCase()}`, booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
