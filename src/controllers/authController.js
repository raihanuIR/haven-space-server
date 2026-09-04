import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { mockUsers } from '../utils/mockStore.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'property_rental_jwt_secret_key_secure_2026', {
    expiresIn: '7d',
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, photo, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const validRole = role && ['Tenant', 'Owner'].includes(role) ? role : 'Tenant';

    if (mongoose.connection.readyState === 1) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      const user = await User.create({
        name,
        email,
        password,
        photo: photo || undefined,
        role: validRole,
      });

      const token = generateToken(user._id);

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          photo: user.photo,
          role: user.role,
        },
      });
    }

    // In-Memory Fallback
    const existing = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const newUser = {
      _id: `user_${Date.now()}`,
      name,
      email,
      password,
      passwordHash: bcrypt.hashSync(password, 8),
      photo: photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      role: validRole,
    };
    mockUsers.push(newUser);

    const token = generateToken(newUser._id);
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        photo: newUser.photo,
        role: newUser.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter both email and password' });
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email });
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const token = generateToken(user._id);
      return res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          photo: user.photo,
          role: user.role,
        },
      });
    }

    // In-Memory Fallback
    const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = user.password === password || (user.passwordHash && bcrypt.compareSync(password, user.passwordHash));
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { name, email, photo } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required from Google account' });
    }

    if (mongoose.connection.readyState === 1) {
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          name: name || 'Google User',
          email,
          photo: photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          role: 'Tenant', // Default role per requirement
        });
      }
      const token = generateToken(user._id);
      return res.json({
        success: true,
        message: 'Google login successful',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          photo: user.photo,
          role: user.role,
        },
      });
    }

    // In-Memory Fallback
    let user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      user = {
        _id: `user_google_${Date.now()}`,
        name: name || 'Google User',
        email,
        photo: photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        role: 'Tenant',
      };
      mockUsers.push(user);
    }
    const token = generateToken(user._id);
    return res.json({
      success: true,
      message: 'Google login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  return res.json({
    success: true,
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      photo: req.user.photo,
      role: req.user.role,
    },
  });
};

export const updateProfile = async (req, res) => {
  try {
    const { name, photo } = req.body;
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      if (name) user.name = name;
      if (photo) user.photo = photo;
      const updated = await user.save();
      return res.json({ success: true, message: 'Profile updated', user: updated });
    }

    // In-memory fallback
    const user = mockUsers.find((u) => u._id === req.user._id);
    if (user) {
      if (name) user.name = name;
      if (photo) user.photo = photo;
    }
    return res.json({ success: true, message: 'Profile updated', user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
