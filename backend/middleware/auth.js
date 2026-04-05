const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Auth token missing' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'staymate_secret');
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Invalid token' });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
};

const requireOwner = (req, res, next) => {
  if (req.user.role !== 'owner') return res.status(403).json({ message: 'Owner access only' });
  next();
};

module.exports = { auth, requireOwner };
