const express = require('express');
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const { auth, requireOwner } = require('../middleware/auth');
const Razorpay = require('razorpay');
const crypto = require('crypto');

let razorpay = null;

const initializeRazorpay = () => {
  const razorpayKeyId = process.env.RAZORPAY_KEY_ID?.trim();
  const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

  if (!razorpayKeyId || !razorpayKeySecret) {
    console.error('Razorpay credentials are not set. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend/.env.');
    return false;
  }

  razorpay = new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret,
  });
  return true;
};

const router = express.Router();

router.post('/create-order', auth, async (req, res) => {
  try {
    if (!razorpay && !initializeRazorpay()) {
      return res.status(500).json({ message: 'Payment service not configured. Please check Razorpay credentials.' });
    }

    const { propertyId, amount } = req.body;
    console.log('create-order request:', {
      propertyId,
      amount,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID ? 'SET' : 'MISSING',
      razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET ? 'SET' : 'MISSING',
    });

    if (!propertyId || !amount) {
      return res.status(400).json({ message: 'Property ID and amount are required' });
    }

    const property = await Property.findById(propertyId);
    console.log('create-order property lookup', { propertyId, propertyFound: !!property });
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `booking_${Date.now()}`,
      notes: {
        propertyId: propertyId,
        userId: req.user._id.toString(),
        ownerId: property.owner.toString(),
      },
    });

    res.json({
      orderId: order.id,
      amount: order.amount / 100,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Razorpay order creation failed raw error:', error);
    console.error('Razorpay order creation failed details:', {
      message: error?.message,
      code: error?.code,
      statusCode: error?.statusCode,
      description: error?.error?.description || error?.error || null,
      keyIdSet: !!process.env.RAZORPAY_KEY_ID,
      keySecretSet: !!process.env.RAZORPAY_KEY_SECRET,
      keyIdLength: (process.env.RAZORPAY_KEY_ID || '').trim().length,
      keySecretLength: (process.env.RAZORPAY_KEY_SECRET || '').trim().length,
      propertyId: req.body.propertyId,
      amount: req.body.amount,
    });
    res.status(500).json({
      message: 'Failed to create order',
      error: error?.error?.description || error?.error || error?.message || 'Unknown Razorpay error',
    });
  }
});

router.post('/verify-payment', auth, async (req, res) => {
  try {
    if (!razorpay && !initializeRazorpay()) {
      return res.status(500).json({ message: 'Payment service not configured. Please check Razorpay credentials.' });
    }

    const { propertyId, orderId, paymentId, signature } = req.body;
    if (!propertyId || !orderId || !paymentId || !signature) {
      return res.status(400).json({ message: 'Missing payment verification details' });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const signingKey = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_default';
    const generatedSignature = crypto
      .createHmac('sha256', signingKey)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature !== signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const booking = new Booking({
      property: property._id,
      user: req.user._id,
      owner: property.owner,
      amount: property.price,
      paymentStatus: 'paid',
      paymentMethod: 'razorpay',
      paymentProvider: 'Razorpay',
      paymentReference: paymentId,
      paymentDetails: { orderId, paymentId },
    });
    await booking.save();

    res.json({ message: 'Booking confirmed', booking });
  } catch (error) {
    res.status(500).json({ message: 'Payment verification failed', error: error.message });
  }
});

router.get('/my', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('property');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load bookings', error: error.message });
  }
});

router.get('/owner/listings', auth, requireOwner, async (req, res) => {
  try {
    const ownerProperties = await Property.find({ owner: req.user._id });
    const propertyIds = ownerProperties.map((p) => p._id);

    const bookings = await Booking.find({ property: { $in: propertyIds } })
      .populate('property')
      .populate('user', 'name email contactNumber');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load owner bookings', error: error.message });
  }
});

module.exports = router;

