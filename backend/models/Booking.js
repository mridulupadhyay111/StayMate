const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['paid', 'pending', 'failed'], default: 'paid' },
  paymentMethod: { type: String, enum: ['card', 'upi', 'qr'], required: true },
  paymentProvider: { type: String, required: true },
  paymentReference: { type: String, required: true },
  paymentDetails: { type: Object },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
