const mongoose = require('mongoose');

const advertisedProductSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  productId: { type: String, required: true }
});

module.exports = mongoose.model('AdvertisedProduct', advertisedProductSchema);
