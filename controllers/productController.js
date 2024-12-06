const Product = require('../models/Product');
const User = require('../models/User');

// เพิ่มสินค้าใหม่
exports.addProduct = async (req, res) => {
  const { id, imageUrl, title, description, pointsRequired, expiryDate, remaining } = req.body;

  try {
    const existingProduct = await Product.findOne({ id });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product with this ID already exists' });
    }

    const product = new Product({
      id,
      imageUrl,
      title,
      description,
      pointsRequired,
      expiryDate,
      remaining
    });

    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ดึงสินค้าทั้งหมด
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ลบสินค้า
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ดึงข้อมูลสินค้าโดย ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// แลกสินค้า
exports.redeemProduct = async (req, res) => {
  // const { productId, quantity } = req.body;
  const { productId } = req.body;
  const quantity = 1;

  try {
    // ค้นหา User จาก Token
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // ค้นหาสินค้า
    const product = await Product.findOne({ id: productId });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // ตรวจสอบคะแนนและจำนวนคงเหลือ
    if (user.points < product.pointsRequired * quantity) {
      return res.status(400).json({ message: 'Not enough points to redeem this product' });
    }
    if (product.remaining < quantity) {
      return res.status(400).json({ message: 'Not enough product remaining' });
    }

    // ลดคะแนนของ User
    user.points -= product.pointsRequired * quantity;

    // ลดจำนวนคงเหลือของสินค้า
    product.remaining -= quantity;

    // บันทึกข้อมูลว่า User แลกสินค้า
    product.redeemedBy.push({
      userId: user._id,
      redeemedAt: new Date()
    });

    await user.save();
    await product.save();

    res.json({
      message: 'Product redeemed successfully',
      remainingPoints: user.points,
      productRemaining: product.remaining,
      redeemedBy: product.redeemedBy
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};