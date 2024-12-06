const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ลงทะเบียน User ใหม่
exports.registerUser = async (req, res) => {
  const { username, password, name } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Username already exists' });

    // สร้าง User ใหม่
    const user = new User({ username, password, name, points: 100 });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// เข้าสู่ระบบ
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid username or password' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// แก้ไขรหัสผ่าน
exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = newPassword; // Password จะถูก Hash โดย Pre Hook
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//เพิ่มคะแนน
exports.updatePoints = async (req, res) => {
  const { points } = req.body;

  try {
    const user = await User.findById(req.user.id); // req.user มาจาก verifyToken
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.points += points; // เพิ่มคะแนน
    await user.save();

    res.json({ message: 'Points updated successfully', points: user.points });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// แลกสินค้า
exports.redeemProduct = async (req, res) => {
  const { productId, productName, quantity, pointsToDeduct } = req.body;

  try {
    // ค้นหา User จาก Token
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // ตรวจสอบคะแนนเพียงพอหรือไม่
    if (user.points < pointsToDeduct) {
      return res.status(400).json({ message: 'Not enough points to redeem this product' });
    }

    // ลดคะแนน
    user.points -= pointsToDeduct;

    // เพิ่มรายการสินค้าที่แลก
    user.redeemedItems.push({
      productId,
      productName,
      quantity
    });

    await user.save();

    res.json({
      message: 'Product redeemed successfully',
      redeemedItems: user.redeemedItems,
      remainingPoints: user.points
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
