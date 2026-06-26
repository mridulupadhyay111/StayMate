const express = require('express');
const multer = require('multer');
const path = require('path');
const Property = require('../models/Property');
const { auth, requireOwner } = require('../middleware/auth');

const router = express.Router();

/* ================= MULTER CONFIG ================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('Only image files are allowed'), false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

/* ================= GET ALL ================= */

router.get('/', async (req, res) => {
  try {
    const { type, sharing, college, location, minPrice, maxPrice, search } = req.query;

    const filters = {};

    if (type) filters.type = type;
    if (sharing) filters.sharing = sharing;

    if (college) {
      filters.college = new RegExp('^' + college + '$', 'i');
    }

    if (location) {
      filters.location = new RegExp(location, 'i');
    }

    if (minPrice) {
      filters.price = { ...filters.price, $gte: Number(minPrice) };
    }

    if (maxPrice) {
      filters.price = { ...filters.price, $lte: Number(maxPrice) };
    }

    if (search) {
      filters.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { location: new RegExp(search, 'i') },
        { college: new RegExp(search, 'i') },
      ];
    }

    const properties = await Property.find(filters).populate('owner', 'name email');

    res.json(properties);

  } catch (error) {
    res.status(500).json({
      message: 'Failed to load properties',
      error: error.message,
    });
  }
});

/* ================= GET SINGLE ================= */

router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'name email');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);

  } catch (error) {
    res.status(500).json({
      message: 'Failed to load property',
      error: error.message,
    });
  }
});

/* ================= CREATE PROPERTY ================= */

router.post(
  '/',
  auth,
  requireOwner,
  upload.single('image'),
  async (req, res) => {
    try {

      if (!req.file) {
        return res.status(400).json({
          message: 'Property image is required',
        });
      }

      const {
        title,
        description,
        type,
        sharing,
        price,
        college,
        location,
        contactNumber,
        nearbyColleges,
      } = req.body;

      const property = new Property({
        owner: req.user._id,
        title,
        description,
        type,
        sharing,
        price,
        college,
        location,
        contactNumber,

        image: '/uploads/' + req.file.filename,

        nearbyColleges: nearbyColleges
          ? nearbyColleges.split(',').map(i => i.trim()).filter(Boolean)
          : [],
      });

      await property.save();

      res.status(201).json(property);

    } catch (error) {
      res.status(500).json({
        message: 'Failed to create property',
        error: error.message,
      });
    }
  }
);

/* ================= UPDATE PROPERTY ================= */

router.put(
  '/:id',
  auth,
  requireOwner,
  upload.single('image'),
  async (req, res) => {
    try {

      const property = await Property.findById(req.params.id);

      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }

      if (!property.owner.equals(req.user._id)) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      const {
        title,
        description,
        type,
        sharing,
        price,
        college,
        location,
        contactNumber,
        nearbyColleges,
      } = req.body;

      property.title = title || property.title;
      property.description = description || property.description;
      property.type = type || property.type;
      property.sharing = sharing || property.sharing;
      property.price = price || property.price;
      property.college = college || property.college;
      property.location = location || property.location;
      property.contactNumber = contactNumber || property.contactNumber;

      property.nearbyColleges = nearbyColleges
        ? nearbyColleges.split(',').map(i => i.trim()).filter(Boolean)
        : property.nearbyColleges;

      if (req.file) {
        property.image = '/uploads/' + req.file.filename;
      }

      await property.save();

      res.json(property);

    } catch (error) {
      res.status(500).json({
        message: 'Failed to update property',
        error: error.message,
      });
    }
  }
);

/* ================= DELETE PROPERTY ================= */

router.delete('/:id', auth, requireOwner, async (req, res) => {
  try {

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (!property.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await property.deleteOne();

    res.json({ message: 'Property deleted successfully' });

  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete property',
      error: error.message,
    });
  }
});

module.exports = router;