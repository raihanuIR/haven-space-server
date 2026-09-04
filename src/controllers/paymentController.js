import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
let stripeInstance = null;
if (stripeSecretKey && !stripeSecretKey.includes('MockKey')) {
  try {
    stripeInstance = new Stripe(stripeSecretKey);
  } catch (err) {
    console.warn('[Stripe Init Warning]:', err.message);
  }
}

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, propertyId, propertyTitle } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid amount is required' });
    }

    const amountInCents = Math.round(Number(amount) * 100);

    // If valid Stripe key is available, create real PaymentIntent
    if (stripeInstance) {
      const paymentIntent = await stripeInstance.paymentIntents.create({
        amount: amountInCents,
        currency: 'usd',
        metadata: {
          propertyId: propertyId || '',
          propertyTitle: propertyTitle || '',
          userId: req.user._id.toString(),
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
