import mongoose from 'mongoose';
import Contact from '../models/Contact.js';
import { mockContacts } from '../utils/mockStore.js';

// Submit new contact inquiry
export const submitContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, subject, and message.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    if (mongoose.connection.readyState === 1) {
      const newContact = await Contact.create({
        name: name.trim(),
        email: email.trim(),
        phone: phone ? phone.trim() : '',
        subject: subject.trim(),
        message: message.trim(),
      });

      return res.status(201).json({
        success: true,
        message: 'Your message has been sent successfully! Our team will respond shortly.',
        contact: newContact,
      });
    }

    // In-memory fallback
    const newMockContact = {
      _id: `contact_${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : '',
      subject: subject.trim(),
      message: message.trim(),
      status: 'Unread',
      createdAt: new Date().toISOString(),
    };
    mockContacts.unshift(newMockContact);

    return res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! Our team will respond shortly.',
      contact: newMockContact,
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// Admin: Get all contact inquiries
export const getContactMessages = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const messages = await Contact.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: messages.length, messages });
    }

    return res.json({ success: true, count: mockContacts.length, messages: mockContacts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Update inquiry status
export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      const contact = await Contact.findByIdAndUpdate(id, { status }, { new: true });
      if (!contact) return res.status(404).json({ success: false, message: 'Message not found' });
      return res.json({ success: true, contact });
    }

    const item = mockContacts.find((c) => c._id === id);
    if (item) {
      item.status = status;
      return res.json({ success: true, contact: item });
    }

    return res.status(404).json({ success: false, message: 'Message not found' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
