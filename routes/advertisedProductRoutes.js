const express = require('express');
const router = express.Router();
const { addAdvertisedProduct, getAdvertisedProducts, getAdvertisedProductById, updateAdvertisedProduct, deleteAdvertisedProduct } = require('../controllers/advertisedProductController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.post('/', verifyToken, checkRole(['admin']), addAdvertisedProduct);

router.get('/', getAdvertisedProducts);

router.get('/:id', getAdvertisedProductById);

router.put('/:id', verifyToken, checkRole(['admin']), updateAdvertisedProduct);

router.delete('/:id', verifyToken, checkRole(['admin']), deleteAdvertisedProduct);

module.exports = router;
