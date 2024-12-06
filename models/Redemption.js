const mongoose = require('mongoose');

const redemptionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rewardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  redeemDate: { type: Date, required: true, default: Date.now },
  status: { type: String, required: true, enum: ['redeemed', 'expired'], default: 'redeemed' }
});

module.exports = mongoose.model('Redemption', redemptionSchema);
