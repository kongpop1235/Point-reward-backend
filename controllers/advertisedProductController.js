const AdvertisedProduct = require('../models/AdvertisedProduct');

// Add
exports.addAdvertisedProduct = async (req, res) => {
  const { imageUrl, title, description, productId } = req.body;

  try {
    const advertisedProduct = new AdvertisedProduct({
      imageUrl,
      title,
      description,
      productId
    });

    await advertisedProduct.save();
    res.status(201).json({ message: 'Advertised product added successfully', advertisedProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all
exports.getAdvertisedProducts = async (req, res) => {
  try {
    const advertisedProducts = await AdvertisedProduct.find().populate('productId', 'title pointsRequired');
    res.json(advertisedProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get by ID
exports.getAdvertisedProductById = async (req, res) => {
  try {
    const advertisedProduct = await AdvertisedProduct.findById(req.params.id).populate('productId', 'title pointsRequired');
    if (!advertisedProduct) return res.status(404).json({ message: 'Advertised product not found' });

    res.json(advertisedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Edit
exports.updateAdvertisedProduct = async (req, res) => {
  const { imageUrl, title, description, productId } = req.body;

  try {
    const advertisedProduct = await AdvertisedProduct.findById(req.params.id);
    if (!advertisedProduct) return res.status(404).json({ message: 'Advertised product not found' });

    if (imageUrl) advertisedProduct.imageUrl = imageUrl;
    if (title) advertisedProduct.title = title;
    if (description) advertisedProduct.description = description;
    if (productId) advertisedProduct.productId = productId;

    await advertisedProduct.save();
    res.json({ message: 'Advertised product updated successfully', advertisedProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete
exports.deleteAdvertisedProduct = async (req, res) => {
  try {
    const advertisedProduct = await AdvertisedProduct.findByIdAndDelete(req.params.id);
    if (!advertisedProduct) return res.status(404).json({ message: 'Advertised product not found' });

    res.json({ message: 'Advertised product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
