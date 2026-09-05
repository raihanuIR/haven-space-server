import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import Transaction from '../models/Transaction.js';

dotenv.config();

const additionalProperties = (owner) => [
  {
    title: 'Pacific Coast Oceanview Penthouse',
    description: 'Breathtaking 3-bedroom luxury penthouse perched right on the bluffs of Malibu. Features panoramic floor-to-ceiling glass windows, wrapping private terrace, chef gourmet kitchen, and private elevator.',
    location: 'Malibu Bluffs, Malibu, CA',
    propertyType: 'Penthouse',
    rentPrice: 4600,
    rentType: 'Monthly',
    bedrooms: 3,
    bathrooms: 3,
    propertySize: 2200,
    amenities: ['WiFi', 'Parking', 'Swimming Pool', 'Air Conditioning', 'Balcony', 'Furnished', 'Elevator'],
    images: [
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    extraFeatures: 'Direct private beach staircase, sunset observation deck.',
    status: 'Approved',
    owner: {
      ownerId: owner._id,
      name: owner.name,
      email: owner.email,
      phone: '+1 (310) 555-0199',
    },
  },
  {
    title: 'Chic Historic Brownstone Residence',
    description: 'Classic Victorian architectural masterpiece located in the quiet historic district. Restored parquet flooring, ornate fireplaces, stained glass windows, and private brick-paved courtyard.',
    location: 'Back Bay, Boston, MA',
    propertyType: 'House',
    rentPrice: 3200,
    rentType: 'Monthly',
    bedrooms: 3,
    bathrooms: 2.5,
    propertySize: 1950,
    amenities: ['WiFi', 'Parking', 'Pets Allowed', 'Garden', 'Furnished', 'Security System'],
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
    ],
    extraFeatures: 'Sub-Zero refrigeration, custom library with built-in shelving.',
    status: 'Approved',
    owner: {
      ownerId: owner._id,
      name: owner.name,
      email: owner.email,
      phone: '+1 (617) 555-0145',
    },
  },
  {
    title: 'Skyline Panorama Highrise Condo',
    description: 'Ultra-modern 34th floor residence overlooking the city skyline. Contemporary minimalist design, automated blackout shades, Italian marble bathrooms, and 24/7 concierge security.',
    location: 'Loop Financial Center, Chicago, IL',
    propertyType: 'Condo',
    rentPrice: 2900,
    rentType: 'Monthly',
    bedrooms: 2,
    bathrooms: 2,
    propertySize: 1350,
    amenities: ['WiFi', 'Gym', 'Air Conditioning', 'Elevator', 'Security System', 'Balcony'],
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    extraFeatures: 'Heated indoor lap pool and sky deck access.',
    status: 'Approved',
    owner: {
      ownerId: owner._id,
      name: owner.name,
      email: owner.email,
      phone: '+1 (312) 555-0176',
    },
  },
  {
    title: 'Rustic Alpine Mountain Chalet',
    description: 'Authentic handcrafted timber chalet surrounded by majestic pines. Soaring cathedral ceilings, floor-to-ceiling stone fireplace, private outdoor cedar hot tub, and ski storage.',
    location: 'Vail Mountain Village, Vail, CO',
    propertyType: 'Villa',
    rentPrice: 4800,
    rentType: 'Monthly',
    bedrooms: 4,
    bathrooms: 3.5,
    propertySize: 3100,
    amenities: ['WiFi', 'Parking', 'Fireplace', 'Pets Allowed', 'Furnished', 'Garden'],
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80'
    ],
    extraFeatures: 'Heated driveway, private dry cedar sauna.',
    status: 'Approved',
    owner: {
      ownerId: owner._id,
      name: owner.name,
      email: owner.email,
      phone: '+1 (970) 555-0122',
    },
  },
  {
    title: 'Urban Industrial Artist Loft',
    description: 'Sprawling creative sanctuary in a renovated 19th-century textile warehouse. Exposed brick masonry, 14-foot timber beam ceilings, polished concrete floors, and northern artist light.',
    location: 'SoHo Design District, New York, NY',
    propertyType: 'Studio',
    rentPrice: 2400,
    rentType: 'Monthly',
    bedrooms: 1,
    bathrooms: 1,
    propertySize: 1100,
    amenities: ['WiFi', 'Air Conditioning', 'Elevator', 'Furnished'],
    images: [
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
    ],
    extraFeatures: 'Acoustic soundproofing, commercial-grade induction range.',
    status: 'Approved',
    owner: {
      ownerId: owner._id,
      name: owner.name,
      email: owner.email,
      phone: '+1 (212) 555-0185',
    },
  },
  {
    title: 'Sunny Tropical Beachside Oasis',
    description: 'Idyllic coastal villa just footsteps away from warm sandy shores. Tropical courtyard garden, plunge pool, outdoor summer kitchen, and open breezes through French louver doors.',
    location: 'South Beach, Miami Beach, FL',
    propertyType: 'Villa',
    rentPrice: 5500,
    rentType: 'Monthly',
    bedrooms: 4,
    bathrooms: 4,
    propertySize: 3400,
    amenities: ['WiFi', 'Parking', 'Swimming Pool', 'Air Conditioning', 'Pets Allowed', 'Balcony', 'Garden'],
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80'
    ],
    extraFeatures: 'Private boat dock slip, outdoor shower.',
    status: 'Approved',
    owner: {
      ownerId: owner._id,
      name: owner.name,
      email: owner.email,
      phone: '+1 (305) 555-0133',
    },
  },
];

const sampleBookingsData = (properties, owner, tenant) => [
  {
    propertyId: properties[1]._id,
    propertyName: properties[1].title,
    propertyImage: properties[1].images[0],
    propertyLocation: properties[1].location,
    tenantId: tenant._id,
    tenantName: tenant.name,
    tenantEmail: tenant.email,
    ownerId: owner._id,
    ownerEmail: owner.email,
    moveInDate: new Date('2026-03-15'),
    contactNumber: '+1 555-0123',
    additionalNotes: 'Moving in mid-March.',
    amountPaid: properties[1].rentPrice || 1950,
    bookingStatus: 'Approved',
    paymentStatus: 'Paid',
    paymentIntentId: 'pi_3L7xsample002',
    createdAt: new Date('2026-03-10'),
  },
  {
    propertyId: properties[2]._id,
    propertyName: properties[2].title,
    propertyImage: properties[2].images[0],
    propertyLocation: properties[2].location,
    tenantId: tenant._id,
    tenantName: tenant.name,
    tenantEmail: tenant.email,
    ownerId: owner._id,
    ownerEmail: owner.email,
    moveInDate: new Date('2026-04-01'),
    contactNumber: '+1 555-0144',
    additionalNotes: 'Need key handover before noon.',
    amountPaid: properties[2].rentPrice || 5200,
    bookingStatus: 'Approved',
    paymentStatus: 'Paid',
    paymentIntentId: 'pi_3L7xsample003',
    createdAt: new Date('2026-03-25'),
  },
  {
    propertyId: properties[3]._id,
    propertyName: properties[3].title,
    propertyImage: properties[3].images[0],
    propertyLocation: properties[3].location,
    tenantId: tenant._id,
    tenantName: tenant.name,
    tenantEmail: tenant.email,
    ownerId: owner._id,
    ownerEmail: owner.email,
    moveInDate: new Date('2026-05-10'),
    contactNumber: '+1 555-0188',
    additionalNotes: 'Corporate relocation booking.',
    amountPaid: properties[3].rentPrice || 2850,
    bookingStatus: 'Approved',
    paymentStatus: 'Paid',
    paymentIntentId: 'pi_3L7xsample004',
    createdAt: new Date('2026-05-02'),
  },
  {
    propertyId: properties[4]._id,
    propertyName: properties[4].title,
    propertyImage: properties[4].images[0],
    propertyLocation: properties[4].location,
    tenantId: tenant._id,
    tenantName: tenant.name,
    tenantEmail: tenant.email,
    ownerId: owner._id,
    ownerEmail: owner.email,
    moveInDate: new Date('2026-06-01'),
    contactNumber: '+1 555-0177',
    additionalNotes: 'Family move with pets.',
    amountPaid: properties[4].rentPrice || 2600,
    bookingStatus: 'Approved',
    paymentStatus: 'Paid',
    paymentIntentId: 'pi_3L7xsample005',
    createdAt: new Date('2026-05-20'),
  },
  {
    propertyId: properties[5]._id,
    propertyName: properties[5].title,
    propertyImage: properties[5].images[0],
    propertyLocation: properties[5].location,
    tenantId: tenant._id,
    tenantName: tenant.name,
    tenantEmail: tenant.email,
    ownerId: owner._id,
    ownerEmail: owner.email,
    moveInDate: new Date('2026-07-05'),
    contactNumber: '+1 555-0155',
    additionalNotes: 'Short summer lease.',
    amountPaid: properties[5].rentPrice || 4200,
    bookingStatus: 'Approved',
    paymentStatus: 'Paid',
    paymentIntentId: 'pi_3L7xsample006',
    createdAt: new Date('2026-06-28'),
  },
  {
    propertyId: properties[0]._id,
    propertyName: properties[0].title,
    propertyImage: properties[0].images[0],
    propertyLocation: properties[0].location,
    tenantId: tenant._id,
    tenantName: tenant.name,
    tenantEmail: tenant.email,
    ownerId: owner._id,
    ownerEmail: owner.email,
    moveInDate: new Date('2026-08-15'),
    contactNumber: '+1 555-0199',
    additionalNotes: 'Re-booking penthouse for vacation.',
    amountPaid: properties[0].rentPrice || 3800,
    bookingStatus: 'Approved',
    paymentStatus: 'Paid',
    paymentIntentId: 'pi_3L7xsample007',
    createdAt: new Date('2026-08-01'),
  },
  {
    propertyId: properties[1]._id,
    propertyName: properties[1].title,
    propertyImage: properties[1].images[0],
    propertyLocation: properties[1].location,
    tenantId: tenant._id,
    tenantName: tenant.name,
    tenantEmail: tenant.email,
    ownerId: owner._id,
    ownerEmail: owner.email,
    moveInDate: new Date('2026-09-20'),
    contactNumber: '+1 555-0122',
    additionalNotes: 'Fall term studio booking.',
    amountPaid: properties[1].rentPrice || 1950,
    bookingStatus: 'Pending',
    paymentStatus: 'Paid',
    paymentIntentId: 'pi_3L7xsample008',
    createdAt: new Date('2026-09-02'),
  },
];

export async function runAdditionalSeed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('[Seed Extension] Connected to MongoDB Atlas');

  const owner = await User.findOne({ role: 'Owner' });
  const tenant = await User.findOne({ role: 'Tenant' });

  if (!owner || !tenant) {
    console.error('Owner or Tenant not found!');
    await mongoose.disconnect();
    return;
  }

  // 1. Add extra properties if count < 13
  const currentApproved = await Property.countDocuments({ status: 'Approved' });
  console.log(`Current approved properties: ${currentApproved}`);

  if (currentApproved < 12) {
    const toInsert = additionalProperties(owner);
    await Property.insertMany(toInsert);
    console.log(`Inserted ${toInsert.length} additional approved properties.`);
  }

  const allProps = await Property.find();

  // 2. Add extra bookings and transactions if booking count < 8
  const bookingCount = await Booking.countDocuments();
  console.log(`Current bookings count: ${bookingCount}`);

  if (bookingCount < 8) {
    const newBookingsData = sampleBookingsData(allProps, owner, tenant);
    for (const bData of newBookingsData) {
      const createdBooking = await Booking.create(bData);
      await Transaction.create({
        transactionId: `TXN_${Date.now()}_${Math.floor(Math.random() * 900 + 100)}`,
        bookingId: createdBooking._id,
        propertyId: bData.propertyId,
        propertyName: bData.propertyName,
        tenantId: tenant._id,
        tenantName: tenant.name,
        tenantEmail: tenant.email,
        ownerId: owner._id,
        ownerName: owner.name,
        ownerEmail: owner.email,
        amount: bData.amountPaid,
        createdAt: bData.createdAt,
      });
    }
    console.log(`Inserted ${newBookingsData.length} additional bookings and transactions.`);
  }

  const finalApproved = await Property.countDocuments({ status: 'Approved' });
  const finalBookings = await Booking.countDocuments();
  const finalTx = await Transaction.countDocuments();

  console.log('--- Seeding Summary ---');
  console.log(`Approved Properties: ${finalApproved} (At 6 per page = ${Math.ceil(finalApproved / 6)} pages)`);
  console.log(`Bookings: ${finalBookings}`);
  console.log(`Transactions: ${finalTx}`);

  await mongoose.disconnect();
}

runAdditionalSeed().catch(console.error);
