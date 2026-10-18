const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const sign = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const send = (res, status, user) => {
  const u = user.toObject();
  delete u.password;
  res.status(status).json({ success: true, token: sign(user), user: u });
};

// Support admin registration when specified
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, city, role } = req.body;
  if (await User.findOne({ email })) throw new AppError('Email already registered', 409);
  const user = await User.create({ name, email, password, phone, city, role: role === 'admin' ? 'admin' : 'user' });
  send(res, 201, user);
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) throw new AppError('Invalid email or password', 401);
  if (!user.isActive) throw new AppError('Account disabled', 403);
  send(res, 200, user);
});

exports.me = asyncHandler(async (req, res) => res.json({ success: true, user: req.user }));

exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, city } = req.body;
  Object.assign(req.user, { ...(name && { name }), ...(phone && { phone }), ...(city && { city }) });
  await req.user.save();
  res.json({ success: true, user: req.user });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(req.body.currentPassword))) throw new AppError('Current password is incorrect', 400);
  user.password = req.body.newPassword;
  await user.save();
  res.json({ success: true, message: 'Password updated' });
});
