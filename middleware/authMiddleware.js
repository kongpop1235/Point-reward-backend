const jwt = require('jsonwebtoken');

// Middleware ตรวจสอบ JWT Token
exports.verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) return res.status(401).json({ message: 'Access Denied' });

  const token = authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access Denied' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    console.error("Token Error:", err.message);
    res.status(400).json({ message: 'Invalid Token' });
  }
};

// Middleware ตรวจสอบ Role
exports.checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access Denied: Insufficient Permissions' });
  }
  next();
};
