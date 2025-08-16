const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    console.log('🔍 Auth header:', authHeader);

    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization header provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    console.log('🔍 Token found:', token.substring(0, 20) + '...');

    // **CRITICAL: Must use your exact JWT_SECRET**
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decoded:', decoded);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name
    };

    console.log('✅ User authenticated:', req.user.email);
    next();

  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { verifyToken };
