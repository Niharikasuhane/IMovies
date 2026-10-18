const Show = require('../models/Show');
const Seat = require('../models/Seat');
const Theatre = require('../models/Theatre');
const Movie = require('../models/Movie');
const Booking = require('../models/Booking');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const generateSeats = require('../utils/seatGenerator');
const { getPagination, pageMeta } = require('../utils/paginate');

// GET /api/shows?movie=&theatre=&city=&date=
exports.getShows = asyncHandler(async (req, res) => {
  const { movie, theatre, city, date } = req.query;
  const { page, limit, skip } = getPagination(req.query, 50, 100);
  const filter = {};
  if (req.query.all !== 'true') {
    filter.status = 'scheduled';
    filter.startTime = { $gte: new Date() };
  }
  if (movie) filter.movie = movie;
  if (theatre) filter.theatre = theatre;
  if (city) {
    filter.theatre = { $in: await Theatre.find({ city: new RegExp(`^${city}$`, 'i') }).distinct('_id') };
  }
  if (date) {
    const d = new Date(date);
    if (isNaN(d)) throw new AppError('Invalid date', 400);
    filter.startTime = { ...(filter.startTime || {}), $gte: new Date(new Date(d).setHours(0, 0, 0, 0)), $lte: new Date(new Date(d).setHours(23, 59, 59, 999)) };
    if (req.query.all !== 'true' && filter.startTime.$gte < new Date()) filter.startTime.$gte = new Date();
  }
  const [data, total] = await Promise.all([
    Show.find(filter).populate('movie', 'title poster language duration').populate('theatre', 'name city address')
      .sort({ startTime: 1 }).skip(skip).limit(limit),
    Show.countDocuments(filter),
  ]);
  res.json({ success: true, data, pagination: pageMeta(total, page, limit) });
});

exports.getShow = asyncHandler(async (req, res) => {
  const show = await Show.findById(req.params.id).populate('movie').populate('theatre', 'name city address');
  if (!show) throw new AppError('Show not found', 404);
  res.json({ success: true, data: show });
});

// GET /api/shows/:id/seats  (real-time state is also pushed via socket.io)
exports.getSeats = asyncHandler(async (req, res) => {
  const now = new Date();
  const seats = await Seat.find({ show: req.params.id }).sort({ row: 1, number: 1 }).lean();
  const data = seats.map((s) => {
    const lockExpired = s.status === 'locked' && s.lockedUntil < now;
    const status = lockExpired ? 'available' : s.status;
    return {
      _id: s._id, row: s.row, number: s.number, label: s.label, type: s.type, price: s.price, status,
      lockedByMe: status === 'locked' && req.user ? String(s.lockedBy) === String(req.user._id) : false,
    };
  });
  res.json({ success: true, data });
});

exports.createShow = asyncHandler(async (req, res) => {
  const { movie, theatre, screenName, startTime, price } = req.body;
  const [m, t] = await Promise.all([Movie.findById(movie), Theatre.findById(theatre)]);
  if (!m) throw new AppError('Movie not found', 404);
  if (!t) throw new AppError('Theatre not found', 404);
  const screen = t.screens.find((s) => s.name === screenName);
  if (!screen) throw new AppError('Screen not found in this theatre', 400);

  const start = new Date(startTime);
  const end = new Date(start.getTime() + (m.duration + 15) * 60000); // +15 min cleaning buffer
  const clash = await Show.exists({
    theatre, screenName, status: 'scheduled', startTime: { $lt: end }, endTime: { $gt: start },
  });
  if (clash) throw new AppError('This screen already has a show during that time', 409);

  const show = await Show.create({
    movie, theatre, screenName, startTime: start, endTime: end, price,
    totalSeats: screen.rows * screen.seatsPerRow, availableSeats: screen.rows * screen.seatsPerRow,
  });
  await Seat.insertMany(generateSeats(show._id, screen, price));
  res.status(201).json({ success: true, data: show });
});

// Only price can change after creation (seats & timing are fixed)
exports.updateShow = asyncHandler(async (req, res) => {
  const show = await Show.findById(req.params.id);
  if (!show) throw new AppError('Show not found', 404);
  if (req.body.price) {
    show.price = req.body.price;
    await Seat.updateMany({ show: show._id, status: 'available', type: 'regular' }, { price: show.price.regular });
    await Seat.updateMany({ show: show._id, status: 'available', type: 'premium' }, { price: show.price.premium });
  }
  if (req.body.status) show.status = req.body.status;
  await show.save();
  res.json({ success: true, data: show });
});

exports.deleteShow = asyncHandler(async (req, res) => {
  const show = await Show.findById(req.params.id);
  if (!show) throw new AppError('Show not found', 404);
  if (await Booking.exists({ show: show._id, status: 'confirmed' })) {
    throw new AppError('Show has confirmed bookings. Cancel the show instead (status=cancelled).', 400);
  }
  await Seat.deleteMany({ show: show._id });
  await show.deleteOne();
  res.json({ success: true, message: 'Show deleted' });
});
