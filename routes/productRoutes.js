const express = require('express');
const router = express.Router();
const { addProduct, getProducts, deleteProduct, getProductById, redeemProduct } = require('../controllers/productController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// เพิ่มสินค้าใหม่
router.post('/', verifyToken, checkRole(['admin']), addProduct);

// ดึงสินค้าทั้งหมด
router.get('/', getProducts);

// ดึงสินค้าตาม ID
router.get('/:id', getProductById);

// ลบสินค้า
router.delete('/:id', verifyToken, checkRole(['admin']), deleteProduct);

// แลกสินค้า
router.post('/redeem', verifyToken, redeemProduct);

module.exports = router;
