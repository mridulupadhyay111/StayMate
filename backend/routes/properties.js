const express = require('express');
const multer = require('multer');
const Property = require('../models/Property');
const { auth, requireOwner } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const { type, sharing, college, location, minPrice, maxPrice, search } = req.query;
    const filters = {};
    if (type) filters.type = type;
    if (sharing) filters.sharing = sharing;
    if (college) filters.college = new RegExp(`^${college}$`, 'i');
    if (location) filters.location = new RegExp(location, 'i');
    if (minPrice) filters.price = { ...filters.price, $gte: Number(minPrice) };
    if (maxPrice) filters.price = { ...filters.price, $lte: Number(maxPrice) };
    if (search) filters.$or = [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { location: new RegExp(search, 'i') },
      { college: new RegExp(search, 'i') },
    ];

    const properties = await Property.find(filters).populate('owner', 'name email');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load properties', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'name email');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load property', error: error.message });
  }
});

router.post('/', auth, requireOwner, upload.single('image'), async (req, res) => {
  try {
    const { title, description, type, sharing, price, college, location, contactNumber, nearbyColleges } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80';
    const property = new Property({
      owner: req.user._id,
      title,
      description,
      type,
      sharing,
      price,
      college,
      location,
      nearbyColleges: nearbyColleges ? nearbyColleges.split(',').map((item) => item.trim()).filter(Boolean) : [],
      contactNumber,
      image,
    });
    await property.save();
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create property', error: error.message });
  }
});

router.put('/:id', auth, requireOwner, upload.single('image'), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (!property.owner.equals(req.user._id)) return res.status(403).json({ message: 'Not authorized' });

    const { title, description, type, sharing, price, college, location, contactNumber, nearbyColleges } = req.body;
    property.title = title || property.title;
    property.description = description || property.description;
    property.type = type || property.type;
    property.sharing = sharing || property.sharing;
    property.price = price || property.price;
    property.college = college || property.college;
    property.location = location || property.location;
    property.contactNumber = contactNumber || property.contactNumber;
    property.nearbyColleges = nearbyColleges ? nearbyColleges.split(',').map((item) => item.trim()).filter(Boolean) : property.nearbyColleges;
    if (req.file) {
      property.image = `/uploads/${req.file.filename}`;
    }

    await property.save();
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update property', error: error.message });
  }
});

router.delete('/:id', auth, requireOwner, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (!property.owner.equals(req.user._id)) return res.status(403).json({ message: 'Not authorized' });

    await property.deleteOne();
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete property', error: error.message });
  }
});

module.exports = router;
