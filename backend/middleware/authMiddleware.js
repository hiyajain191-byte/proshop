import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';

// @desc   Protect routes (PRIVATE ROUTES)
// @usage  adds req.user
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Read JWT from cookie
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // 2. No token → not authorized
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Get user from DB (IMPORTANT PART)
    req.user = await User.findById(decoded.userId).select('-password');

    if (!req.user) {
      res.status(401);
      throw new Error('User not found');
    }

    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

// @desc   Admin check middleware
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as admin');
  }
};

export { protect, admin };