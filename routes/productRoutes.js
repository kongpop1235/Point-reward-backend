const express = require('express');
const router = express.Router();
const { addProduct, getProducts, deleteProduct, getProductById } = require('../controllers/productController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// เพิ่มสินค้าใหม่ (เฉพาะ Admin)
router.post('/', verifyToken, checkRole(['admin']), addProduct);

// ดึงสินค้าทั้งหมด (Public)
router.get('/', getProducts);

// ดึงสินค้าตาม ID (Public)
router.get('/:id', getProductById);

// ลบสินค้า (เฉพาะ Admin)
router.delete('/:id', verifyToken, checkRole(['admin']), deleteProduct);

module.exports = router;
