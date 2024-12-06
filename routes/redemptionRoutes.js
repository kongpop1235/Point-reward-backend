const express = require('express');
const router = express.Router();
const { addRedemptionCode, redeemCode } = require('../controllers/redemptionController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// Admin เพิ่มรหัสแลก
router.post('/add', verifyToken, checkRole(['admin']), addRedemptionCode);

// User ใช้รหัสแลก
router.post('/redeem', verifyToken, redeemCode);

module.exports = router;
