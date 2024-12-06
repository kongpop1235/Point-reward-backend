const Redemption = require('../models/Redemption');
const Product = require('../models/Product');
const User = require('../models/User');
const { updateRedeemedItems } = require('./userController');

// Admin เพิ่มรหัสแลก
exports.addRedemptionCode = async (req, res) => {
  const { id, userId, rewardId } = req.body;

  try {
    // ตรวจสอบ Reward
    const reward = await Product.findById(rewardId);
    if (!reward) return res.status(404).json({ message: 'Reward not found' });

    // ตรวจสอบ User
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // เพิ่ม Redemption Code
    const redemption = new Redemption({ id, userId, rewardId });
    await redemption.save();

    res.status(201).json({ message: 'Redemption code added successfully', redemption });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// User ใช้รหัสแลก
exports.redeemCode = async (req, res) => {
  const { id } = req.body;

  try {
    // ตรวจสอบ Redemption Code
    const redemption = await Redemption.findOne({ id });
    if (!redemption) return res.status(404).json({ message: 'Invalid redemption code' });

    // ตรวจสอบสถานะ
    if (redemption.status !== 'redeemed') {
      return res.status(400).json({ message: 'This code has already been used or expired' });
    }

    // ค้นหา Product
    const product = await Product.findById(redemption.rewardId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // อัปเดตข้อมูล Redeemed Items ใน User
    await updateRedeemedItems(redemption.userId, product._id, product.title, 1);

    // อัปเดตสถานะเป็น expired
    redemption.status = 'expired';
    await redemption.save();

    res.json({ message: 'Redemption successful', redemption });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
