import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    propertyType: {
      type: String,
      required: true,
      enum: ['Apartment', 'House', 'Villa', 'Studio', 'Penthouse', 'Condo'],
      default: 'Apartment',
    },
    rentPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    rentType: {
      type: String,
      required: true,
      enum: ['Monthly', 'Weekly', 'Daily'],
      default: 'Monthly',
    },
    bedrooms: {
      type: Number,
      required: true,
      default: 1,
    },
    bathrooms: {
      type: Number,
      required: true,
      default: 1,
    },
    propertySize: {
      type: Number, // in square feet / meters
      required: true,
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      required: true,
      validate: [val => val.length > 0, 'At least one image is required'],
    },
    extraFeatures: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    rejectionFeedback: {
      type: String,
      default: '',
    },
    owner: {
      ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        default: '',
      },
    },
  },
  { timestamps: true }
);

// Text index for location & title search
propertySchema.index({ location: 'text', title: 'text' });

const Property = mongoose.model('Property', propertySchema);
export default Property;
