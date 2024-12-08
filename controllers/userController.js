const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register
exports.registerUser = async (req, res) => {
  const { username, password, name } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Username already exists' });

    // Create a new User
    const user = new User({ username, password, name, points: 100 });
    await user.save();
    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      token,
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        points: user.points,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid username or password' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Edit password
exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// increase score
exports.updatePoints = async (req, res) => {
  const { points } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.points += points;
    await user.save();

    res.json({ message: 'Points updated successfully', points: user.points });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Data update Redeemed Items
exports.updateRedeemedItems = async (userId, productId, title, quantity) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    user.redeemedItems.push({
      productId,
      title,
      quantity,
      redeemedAt: new Date()
    });

    await user.save();
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Get user information
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      id: user._id,
      username: user.username,
      name: user.name,
      points: user.points,
      role: user.role,
      redeemedItems: user.redeemedItems
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};