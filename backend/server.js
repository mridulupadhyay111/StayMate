const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const propertiesRoutes = require('./routes/properties');
const bookingsRoutes = require('./routes/bookings');
const ownersRoutes = require('./routes/owners');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/owners', ownersRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'StayMate backend is running' });
});

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 8080;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });

app.use(express.static(path.join(__dirname, "../frontend/dist")));

// React routing fix
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// PORT
