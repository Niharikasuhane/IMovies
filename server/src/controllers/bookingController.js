const Booking = require('../models/Booking');
const Seat = require('../models/Seat');
const Show = require('../models/Show');
const Payment = require('../models/Payment');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const seatService = require('../utils/seatService');
const notify = require('../utils/notify');
const { getPagination, pageMeta } = require('../utils/paginate');

const populateBooking = (q) =>
  q.populate({ path: 'show', populate: [{ path: 'movie', select: 'title poster language duration' }, { path: 'theatre', select: 'name city address' }] })
    .populate('payment', 'status method transactionId amount');

// Create a PENDING booking from seats the user has already locked. Amount is computed server-side.
exports.createBooking = asyncHandler(async (req, res) => {
  const { showId, seatIds } = req.body;
  const show = await Show.findById(showId);
  if (!show || show.status !== 'scheduled') throw new AppError('Show not available', 404);

  const seats = await Seat.find({ _id: { $in: seatIds }, show: showId });
  const now = new Date();
  const valid = seats.length === seatIds.length &&
    seats.every((s) => s.status === 'locked' && String(s.lockedBy) === String(req.user._id) && s.lockedUntil > now);
  if (!valid) throw new AppError('Seat hold expired or invalid. Please select seats again.', 409);

  const total = seats.reduce((sum, s) => sum + s.price, 0);
  const booking = await Booking.create({
    user: req.user._id, show: showId, seats: seats.map((s) => s._id),
    seatLabels: seats.map((s) => s.label).sort(), totalAmount: total,
    expiresAt: new Date(Math.min(...seats.map((s) => s.lockedUntil.getTime()))),
  });
  res.status(201).json({ success: true, data: booking });
});

exports.getMyBookings = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query, 10);
  const { type } = req.query; // upcoming | past | cancelled
  const filter = { user: req.user._id, status: { $in: ['confirmed', 'cancelled'] } };
  let bookings = await populateBooking(Booking.find(filter).sort({ createdAt: -1 }));
  const now = new Date();
  if (type === 'upcoming') bookings = bookings.filter((b) => b.status === 'confirmed' && b.show && b.show.startTime > now);
  else if (type === 'past') bookings = bookings.filter((b) => b.status === 'confirmed' && b.show && b.show.startTime <= now);
  else if (type === 'cancelled') bookings = bookings.filter((b) => b.status === 'cancelled');
  const total = bookings.length;
  res.json({ success: true, data: bookings.slice(skip, skip + limit), pagination: pageMeta(total, page, limit) });
});

exports.getBooking = asyncHandler(async (req, res) => {
  const booking = await populateBooking(Booking.findById(req.params.id));
  if (!booking) throw new AppError('Booking not found', 404);
  if (String(booking.user) !== String(req.user._id) && req.user.role !== 'admin') throw new AppError('Forbidden', 403);
  res.json({ success: true, data: booking });
});

exports.cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('show');
  if (!booking) throw new AppError('Booking not found', 404);
  if (String(booking.user) !== String(req.user._id) && req.user.role !== 'admin') throw new AppError('Forbidden', 403);
  if (booking.status !== 'confirmed') throw new AppError(`Only confirmed bookings can be cancelled (current: ${booking.status})`, 400);

  const hours = parseFloat(process.env.CANCEL_BEFORE_HOURS) || 2;
  const cutoff = new Date(booking.show.startTime.getTime() - hours * 3600 * 1000);
  if (req.user.role !== 'admin' && new Date() > cutoff) {
    throw new AppError(`Bookings can only be cancelled up to ${hours} hours before the show`, 400);
  }

  booking.status = 'cancelled';
  booking.cancelledAt = new Date();
  await booking.save();
  await seatService.freeBooked({ showId: booking.show._id, seatIds: booking.seats, io: req.app.get('io') });
  if (booking.payment) await Payment.findByIdAndUpdate(booking.payment, { status: 'refunded' });
  await notify(booking.user, 'Booking cancelled', `Booking ${booking.bookingCode} was cancelled. Refund of ₹${booking.totalAmount} initiated.`, 'cancellation');
  res.json({ success: true, message: 'Booking cancelled. Refund initiated.', data: booking });
});

// ADMIN: all bookings
exports.getAllBookings = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query, 15);
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const [data, total] = await Promise.all([
    populateBooking(Booking.find(filter).populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit)),
    Booking.countDocuments(filter),
  ]);
  res.json({ success: true, data, pagination: pageMeta(total, page, limit) });
});
