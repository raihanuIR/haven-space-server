import Stripe from 'stripe';

const getStripeInstance = () => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (stripeSecretKey && !stripeSecretKey.includes('MockKey')) {
    try {
      return new Stripe(stripeSecretKey);
    } catch (err) {
      console.warn('[Stripe Init Warning]:', err.message);
    }
  }
  return null;
};

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, propertyId, propertyTitle } = req.body;

    // Property owners are strictly prohibited from booking properties or initiating rental payments
    if (req.user?.role === 'Owner') {
      return res.status(403).json({
        success: false,
        message: 'Property owners are not permitted to initiate property bookings or payments.',
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid amount is required' });
    }

    const amountInCents = Math.round(Number(amount) * 100);
    const stripe = getStripeInstance();

    // If valid Stripe key is available, create real PaymentIntent
    if (stripe) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'usd',
        metadata: {
          propertyId: propertyId ? propertyId.toString() : '',
          propertyTitle: propertyTitle || '',
          userId: req.user?._id ? req.user._id.toString() : 'user',
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return res.json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    }

    // Fallback Mock Payment Intent for local test environment
    const mockIntentId = `pi_mock_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    return res.json({
      success: true,
      clientSecret: `${mockIntentId}_secret_demo`,
      paymentIntentId: mockIntentId,
      isMock: true,
    });
  } catch (error) {
    console.error('[Stripe Payment Intent Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
