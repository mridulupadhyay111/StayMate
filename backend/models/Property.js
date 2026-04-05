const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  type: { type: String, enum: ['PG', 'Hostel', 'Flat', 'Mess'], required: true },
  sharing: { type: String, enum: ['Single', 'Double', 'Triple', 'Four+'], required: true },
  price: { type: Number, required: true },
  college: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  nearbyColleges: [{ type: String, trim: true }],
  contactNumber: { type: String, trim: true },
  image: { type: String, default: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80' },
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
