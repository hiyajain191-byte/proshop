import asyncHandler from '../middleware/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';

/* ================= AUTH ================= */
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

/* ================= REGISTER ================= */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body || {};

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid user data');
  }

  generateToken(res, user._id);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

/* ================= LOGOUT ================= */
const logoutUser = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ message: 'Logged out successfully' });
};

/* ================= PROFILE ================= */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

/* ================= UPDATE PROFILE ================= */
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { name, email, password } = req.body || {};

  if (name) user.name = name;
  if (email) user.email = email;

  if (password) {
    user.password = password;
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
  });
});

/* ================= GET USERS ================= */
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

/* ================= DELETE USER ================= */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.isAdmin) {
    res.status(400);
    throw new Error('Cannot delete admin user');
  }

  await user.deleteOne();

  res.json({ message: 'User removed' });
});

/* ================= GET USER BY ID ================= */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(user);
});

/* ================= UPDATE USER (ADMIN) ================= */
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { name, email, isAdmin } = req.body || {};

  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;

  // SAFE BOOLEAN HANDLING
  if (typeof isAdmin !== 'undefined') {
    user.isAdmin = isAdmin === true || isAdmin === 'true';
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
  });
});

/* ================= EXPORTS ================= */
export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};