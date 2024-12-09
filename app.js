const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ใช้ CORS Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Specify permission from frontend at localhost:3000
  credentials: true // Allow Cookies and Headers
}));

// Middleware
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const redemptionRoutes = require('./routes/redemptionRoutes');
const advertisedProductRoutes = require('./routes/advertisedProductRoutes');

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/redemptions', redemptionRoutes);
app.use('/api/advertised-products', advertisedProductRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
