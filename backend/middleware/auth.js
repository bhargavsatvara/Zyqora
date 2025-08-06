const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'someSuperSecretKey');
    req.user = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const authorizeAdmin = async (req, res, next) => {
  try {
    console.log("authorizeAdmin ---------- >>", req.user);
    const user = await User.findById(req.user);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    req.userData = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const optionalAuthenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'someSuperSecretKey');
      req.user = decoded.userId;
    } catch (err) {
      // Invalid token, treat as guest
      req.user = undefined;
    }
  }
  next();
};

module.exports = { authenticate, authorizeAdmin, optionalAuthenticate }; 