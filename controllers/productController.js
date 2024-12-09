const Product = require('../models/Product');
const User = require('../models/User');
const { updateRedeemedItems } = require('./userController');

// Add
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

// Get all
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().select('-redeemedBy');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete
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

// Get by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id }).select('-redeemedBy');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add redeem product
exports.redeemProduct = async (req, res) => {
  // const { productId, quantity } = req.body;
  const { productId } = req.body;
  const quantity = 1;

  try {
    // Find User by Token
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Search for products
    const product = await Product.findOne({ id: productId });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Check points and remaining amount
    if (user.points < product.pointsRequired * quantity) {
      return res.status(400).json({ message: 'Not enough points to redeem this product' });
    }
    if (product.remaining < quantity) {
      return res.status(400).json({ message: 'Not enough product remaining' });
    }

    // Reduce your score. User
    user.points -= product.pointsRequired * quantity;

    // Reduce the amount of merchandise remaining
    product.remaining -= quantity;

    // Update information Redeemed Items ใน User
    await updateRedeemedItems(user._id, product._id, product.title, quantity);

    // Record information that User exchanges products
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