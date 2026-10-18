const User = require('../models/User');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Show = require('../models/Show');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const asyncHandler = require('../utils/asyncHandler');
const { getPagination, pageMeta } = require('../utils/paginate');

exports.stats = asyncHandler(async (req, res) => {
  const [users, movies, theatres, shows, bookings, revenueAgg, topMovies] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Movie.countDocuments({ isActive: true }),
    Theatre.countDocuments({ isActive: true }),
    Show.countDocuments({ status: 'scheduled', startTime: { $gte: new Date() } }),
    Booking.countDocuments({ status: 'confirmed' }),
    Payment.aggregate([{ $match: { status: 'success' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $lookup: { from: 'shows', localField: 'show', foreignField: '_id', as: 'show' } },
      { $unwind: '$show' },
      { $group: { _id: '$show.movie', tickets: { $sum: { $size: '$seats' } }, revenue: { $sum: '$totalAmount' } } },
      { $sort: { tickets: -1 } }, { $limit: 5 },
      { $lookup: { from: 'movies', localField: '_id', foreignField: '_id', as: 'movie' } },
      { $unwind: '$movie' },
      { $project: { title: '$movie.title', tickets: 1, revenue: 1 } },
    ]),
  ]);
  res.json({ success: true, data: { users, movies, theatres, upcomingShows: shows, bookings, revenue: revenueAgg[0]?.total || 0, topMovies } });
});

exports.getUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query, 20);
  const [data, total] = await Promise.all([User.find().sort({ createdAt: -1 }).skip(skip).limit(limit), User.countDocuments()]);
  res.json({ success: true, data, pagination: pageMeta(total, page, limit) });
});

exports.toggleUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Cannot disable an admin' });
  user.isActive = !user.isActive;
  await user.save();
  res.json({ success: true, data: user });
});
