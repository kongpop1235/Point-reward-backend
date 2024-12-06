const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// เชื่อมต่อ MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

// ใช้ Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// เริ่มต้น Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
