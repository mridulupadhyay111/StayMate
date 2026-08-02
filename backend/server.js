
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const authRoutes = require('./routes/auth');
const propertiesRoutes = require('./routes/properties');
const bookingsRoutes = require('./routes/bookings');
const ownersRoutes = require('./routes/owners');

console.log('ENV CHECK:', {
  key: process.env.RAZORPAY_KEY_ID,
  secret: process.env.RAZORPAY_KEY_SECRET,
});
console.log('FILE EXISTS:', fs.existsSync(path.join(__dirname, '.env')));

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/owners', ownersRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'StayMate backend is running' });
});

// Serve frontend (Vite build)
/*app.use(express.static(path.join(__dirname, "../frontend/dist")));

// React routing fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});*/

// MongoDB connection + server start
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 8080;

const startServer = () => {
  const server = app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      const fallbackPort = Number(PORT) + 1;
      console.warn(`Port ${PORT} is busy. Retrying on ${fallbackPort}...`);
      const fallbackServer = app.listen(fallbackPort, () => console.log(`Server listening on port ${fallbackPort}`));
      fallbackServer.on('error', (fallbackError) => {
        console.error('Server failed to start:', fallbackError.message);
        process.exit(1);
      });
    } else {
      console.error('Server failed to start:', error.message);
      process.exit(1);
    }
  });
};

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    startServer();
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });