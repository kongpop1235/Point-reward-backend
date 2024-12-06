const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  pointsRequired: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  remaining: { type: Number, required: true }
});

module.exports = mongoose.model('Product', productSchema);
