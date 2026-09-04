import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Property from '../models/Property.js';
import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Transaction from '../models/Transaction.js';
import connectDB from '../config/db.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('[Seed] Database already seeded. Skipping initial seed.');
      return;
    }

    console.log('[Seed] Seeding initial database records...');

    // 1. Create Default Users (Admin, Owner, Tenant)
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@rentalhub.com',
      password: 'AdminPassword123!',
      role: 'Admin',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    });

    const owner = await User.create({
      name: 'Michael Vance',
      email: 'owner@rentalhub.com',
      password: 'OwnerPassword123!',
      role: 'Owner',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    });

    const tenant = await User.create({
      name: 'Sarah Jenkins',
      email: 'tenant@rentalhub.com',
      password: 'TenantPassword123!',
      role: 'Tenant',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    });

    console.log('[Seed] Users created successfully:');
    console.log(' - Admin: admin@rentalhub.com / AdminPassword123!');
    console.log(' - Owner: owner@rentalhub.com / OwnerPassword123!');
    console.log(' - Tenant: tenant@rentalhub.com / TenantPassword123!');

    // 2. Create Initial Properties
    const propertiesData = [
      {
        title: 'Azure Sky Penthouse with Panoramic Bay Views',
        description: 'Exquisite 3-bedroom luxury penthouse overlooking the waterfront. Features floor-to-ceiling glass windows, private rooftop infinity pool, Italian marble flooring, and smart home automation.',
        location: 'Downtown Waterfront, Miami, FL',
        propertyType: 'Penthouse',
        rentPrice: 3800,
        rentType: 'Monthly',
        bedrooms: 3,
        bathrooms: 3,
        propertySize: 2450,
        amenities: ['WiFi', 'Parking', 'Swimming Pool', 'Gym', 'Air Conditioning', 'Pets Allowed', 'Furnished', 'Balcony'],
        images: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
        ],
        extraFeatures: 'Private elevator access, 24/7 concierge, Sub-Zero wine cellar.',
        status: 'Approved',
        owner: {
          ownerId: owner._id,
          name: owner.name,
          email: owner.email,
          phone: '+1 (305) 555-0192',
        },
      },
      {
        title: 'Modern Minimalist Loft in Tech District',
        description: 'Chic, open-concept urban loft with high ceilings, exposed brick walls, and industrial accents. Walking distance to premier cafes, tech hubs, and metro lines.',
        location: 'Silicon Alley, Austin, TX',
        propertyType: 'Studio',
        rentPrice: 1950,
        rentType: 'Monthly',
        bedrooms: 1,
        bathrooms: 1,
        propertySize: 850,
        amenities: ['WiFi', 'Gym', 'Air Conditioning', 'Furnished', 'Elevator'],
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
        ],
        extraFeatures: 'Gigabit fiber internet pre-installed, keyless smart lock.',
        status: 'Approved',
        owner: {
          ownerId: owner._id,
          name: owner.name,
          email: owner.email,
          phone: '+1 (512) 555-0144',
        },
      },
      {
        title: 'Serene Highland Villa with Private Garden',
        description: 'Charming 4-bedroom sanctuary nestled in peaceful hills. Includes a landscaped private yard, heated pool, gourmet chef kitchen, and dual master suites.',
        location: 'Beverly Hills Foothills, Los Angeles, CA',
        propertyType: 'Villa',
        rentPrice: 5200,
        rentType: 'Monthly',
        bedrooms: 4,
        bathrooms: 4,
        propertySize: 3600,
        amenities: ['WiFi', 'Parking', 'Swimming Pool', 'Air Conditioning', 'Pets Allowed', 'Garden', 'Security System'],
        images: [
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80'
        ],
        extraFeatures: 'Solar panels with backup battery, organic citrus orchard.',
        status: 'Approved',
        owner: {
          ownerId: owner._id,
          name: owner.name,
          email: owner.email,
          phone: '+1 (310) 555-0188',
        },
      },
      {
        title: 'Contemporary Waterfront Apartment',
        description: 'Breathtaking 2-bedroom residence featuring hardwood flooring, stainless steel European appliances, and a sun-drenched private terrace overlooking the marina.',
        location: 'Pacific Heights, San Francisco, CA',
        propertyType: 'Apartment',
        rentPrice: 2850,
        rentType: 'Monthly',
        bedrooms: 2,
        bathrooms: 2,
        propertySize: 1250,
        amenities: ['WiFi', 'Parking', 'Gym', 'Air Conditioning', 'Balcony', 'Dishwasher'],
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1502005229762-ee1b2b81e469?auto=format&fit=crop&w=1200&q=80'
        ],
        extraFeatures: 'EV charging station in private garage, secured storage unit.',
        status: 'Approved',
        owner: {
          ownerId: owner._id,
          name: owner.name,
          email: owner.email,
          phone: '+1 (415) 555-0123',
        },
      },
      {
        title: 'Emerald Grove Suburban Family Residence',
        description: 'Spacious 3-bedroom craftsman home with open floor plan, fireplace, private fenced backyard, and attached two-car garage located near top-rated schools.',
        location: 'Bellevue Suburbs, Seattle, WA',
        propertyType: 'House',
        rentPrice: 2600,
        rentType: 'Monthly',
        bedrooms: 3,
        bathrooms: 2.5,
        propertySize: 2100,
        amenities: ['WiFi', 'Parking', 'Pets Allowed', 'Garden', 'Fireplace', 'Garage'],
        images: [
          'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80'
        ],
        extraFeatures: 'High-efficiency heat pump, walk-in closets in every bedroom.',
        status: 'Approved',
        owner: {
          ownerId: owner._id,
          name: owner.name,
          email: owner.email,
          phone: '+1 (206) 555-0177',
        },
      },
      {
        title: 'The Grand View Central Luxury Condo',
        description: 'Upscale corner condo on the 18th floor offering stunning skyline panoramas, custom Italian cabinetry, quartz countertops, and dedicated valet service.',
        location: 'Midtown Manhattan, New York, NY',
        propertyType: 'Condo',
        rentPrice: 4200,
        rentType: 'Monthly',
        bedrooms: 2,
        bathrooms: 2,
        propertySize: 1400,
        amenities: ['WiFi', 'Gym', 'Air Conditioning', 'Furnished', 'Elevator', 'Security System'],
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80'
        ],
        extraFeatures: '24/7 doorman, resident sky lounge, steam room & sauna.',
        status: 'Approved',
        owner: {
          ownerId: owner._id,
          name: owner.name,
          email: owner.email,
          phone: '+1 (212) 555-0111',
        },
      },
      {
        title: 'Sunlit Coastal Beachfront Bungalow',
        description: 'Wake up to the sound of waves in this serene 2-bedroom bungalow just steps away from pristine sandy beaches.',
        location: 'Laguna Beach, CA',
        propertyType: 'House',
        rentPrice: 3400,
        rentType: 'Monthly',
        bedrooms: 2,
        bathrooms: 2,
        propertySize: 1550,
        amenities: ['WiFi', 'Parking', 'Pets Allowed', 'Balcony', 'Furnished'],
        images: [
          'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80'
        ],
        extraFeatures: 'Direct beach boardwalk access, private outdoor shower.',
        status: 'Approved',
        owner: {
          ownerId: owner._id,
          name: owner.name,
          email: owner.email,
          phone: '+1 (949) 555-0132',
        },
      },
      {
        title: 'Historic Brick Loft with Skylight',
        description: 'Character-filled artist loft with exposed timber beams and oversized windows.',
        location: 'Old Town, Chicago, IL',
        propertyType: 'Apartment',
        rentPrice: 2100,
        rentType: 'Monthly',
        bedrooms: 1,
        bathrooms: 1,
        propertySize: 950,
        amenities: ['WiFi', 'Air Conditioning', 'Elevator'],
        images: [
          'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1200&q=80'
        ],
        extraFeatures: 'Original 1920s pine wood floors.',
        status: 'Pending',
        owner: {
          ownerId: owner._id,
          name: owner.name,
          email: owner.email,
          phone: '+1 (312) 555-0189',
        },
      },
      {
        title: 'Mountain Retreat Cabin with Hot Tub',
        description: 'Cozy alpine cabin offering tranquility and forest views.',
        location: 'Aspen Highlands, CO',
        propertyType: 'House',
        rentPrice: 4500,
        rentType: 'Monthly',
        bedrooms: 3,
        bathrooms: 2,
        propertySize: 1800,
        amenities: ['WiFi', 'Parking', 'Fireplace', 'Hot Tub'],
        images: [
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
        ],
        extraFeatures: 'Ski-in / ski-out trail access.',
        status: 'Rejected',
        rejectionFeedback: 'The uploaded photo quality is insufficient and property documentation requires permit verification.',
        owner: {
          ownerId: owner._id,
          name: owner.name,
          email: owner.email,
          phone: '+1 (970) 555-0165',
        },
      },
    ];

    const createdProperties = await Property.insertMany(propertiesData);
    console.log(`[Seed] Inserted ${createdProperties.length} properties.`);

    // 3. Create Sample Customer Reviews
    const reviewsData = [
      {
        propertyId: createdProperties[0]._id,
        tenantId: tenant._id,
        name: 'Sarah Jenkins',
        email: 'sarah.j@gmail.com',
        rating: 5,
        comment: 'Staying at Azure Sky Penthouse was an absolute dream! The bay views at sunset are unbeatable and the amenities made working remotely effortless.',
      },
      {
        propertyId: createdProperties[1]._id,
        tenantId: tenant._id,
        name: 'David Chen',
        email: 'david.chen@techmail.io',
        rating: 5,
        comment: 'Super fast internet, impeccably clean, and the location in Silicon Alley saved me 30 minutes of commute every morning. 10/10 recommendation!',
      },
      {
        propertyId: createdProperties[2]._id,
        tenantId: tenant._id,
        name: 'Elena Rostova',
        email: 'elena.rostova@luxuryliving.org',
        rating: 5,
        comment: 'The villa exceeded every expectation. Private garden was stunning and the owner Michael was extremely attentive and accommodating.',
      },
      {
        propertyId: createdProperties[3]._id,
        tenantId: tenant._id,
        name: 'Marcus Brody',
        email: 'mbrody@designlab.com',
        rating: 5,
        comment: 'Booking and paying via Stripe was fast and hassle-free. The waterfront apartment looks exactly like the high-res photos. Will definitely book again!',
      },
    ];

    await Review.insertMany(reviewsData);
    console.log('[Seed] Inserted 4 featured customer reviews.');

    // 4. Create Initial Bookings & Transactions for Analytics
    const sampleBooking = await Booking.create({
      propertyId: createdProperties[0]._id,
      propertyName: createdProperties[0].title,
      propertyImage: createdProperties[0].images[0],
      propertyLocation: createdProperties[0].location,
      tenantId: tenant._id,
      tenantName: tenant.name,
      tenantEmail: tenant.email,
      ownerId: owner._id,
      ownerEmail: owner.email,
      moveInDate: new Date('2026-10-01'),
      contactNumber: '+1 555-0199',
      additionalNotes: 'Need parking spot for electric vehicle.',
      amountPaid: 3800,
      bookingStatus: 'Approved',
      paymentStatus: 'Paid',
      stripeSessionId: 'cs_test_sample_001',
      paymentIntentId: 'pi_3L7xsample001',
    });

    await Transaction.create({
      transactionId: 'TXN_20260901_001',
      bookingId: sampleBooking._id,
      propertyId: createdProperties[0]._id,
      propertyName: createdProperties[0].title,
      tenantId: tenant._id,
      tenantName: tenant.name,
      tenantEmail: tenant.email,
      ownerId: owner._id,
      ownerName: owner.name,
      ownerEmail: owner.email,
      amount: 3800,
    });

    console.log('[Seed] Database initialization complete!');
  } catch (error) {
    console.error('[Seed Error]:', error.message);
  }
};
