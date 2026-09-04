import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import Transaction from '../models/Transaction.js';

export const getOwnerAnalytics = async (req, res) => {
  try {
    const ownerId = req.user._id;

    // 1. Total properties owned
    const totalProperties = await Property.countDocuments({ 'owner.ownerId': ownerId });

    // 2. Total bookings confirmed (or all paid bookings for owner's properties)
    const bookings = await Booking.find({ ownerId, paymentStatus: 'Paid' });
    const totalBookings = bookings.length;

    // 3. Total earnings: sum of all successful payments
    const totalEarnings = bookings.reduce((sum, item) => sum + (item.amountPaid || 0), 0);

    // 4. Monthly earnings for the last 12 months
    const monthlyEarningsMap = {};
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const now = new Date();
    // Pre-populate last 12 months in chronological order
    const monthlyData = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      monthlyEarningsMap[key] = 0;
      monthlyData.push({ month: key, earnings: 0, bookings: 0 });
    }

    // Aggregate booking earnings by month
    bookings.forEach((booking) => {
      const date = new Date(booking.createdAt);
      const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      if (monthlyEarningsMap[key] !== undefined) {
        monthlyEarningsMap[key] += booking.amountPaid || 0;
      }
    });

    // Populate data for recharts
    monthlyData.forEach((item) => {
      item.earnings = monthlyEarningsMap[item.month] || 0;
      item.bookings = bookings.filter((b) => {
        const d = new Date(b.createdAt);
        return `${monthNames[d.getMonth()]} ${d.getFullYear()}` === item.month;
      }).length;
    });

    return res.json({
      success: true,
      analytics: {
        totalProperties,
        totalBookings,
        totalEarnings,
        monthlyData,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
