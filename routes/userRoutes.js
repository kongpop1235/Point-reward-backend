const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updatePassword, updatePoints, redeemProduct } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

// ลงทะเบียน
router.post('/register', registerUser);

// เข้าสู่ระบบ
router.post('/login', loginUser);

// แก้ไขรหัสผ่าน
router.put('/password', verifyToken, updatePassword);

// อัปเดตคะแนน
router.put('/points', verifyToken, updatePoints);

// แลกสินค้า
router.post('/redeem', verifyToken, redeemProduct);

module.exports = router;
