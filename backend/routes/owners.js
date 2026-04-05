const express = require('express');
const Property = require('../models/Property');
const { auth, requireOwner } = require('../middleware/auth');

const router = express.Router();

router.get('/listings', auth, requireOwner, async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load owner listings', error: error.message });
  }
});

module.exports = router;
