const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  pointsRequired: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  remaining: { type: Number, required: true },
  redeemedBy: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      redeemedAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Product', productSchema);
