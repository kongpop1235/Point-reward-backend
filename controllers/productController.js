const Product = require('../models/Product');

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
