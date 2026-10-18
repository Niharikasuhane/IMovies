// Core seat availability logic (locking, releasing, expiry). Used by controllers + background job.
const Seat = require('../models/Seat');
const Show = require('../models/Show');
const Booking = require('../models/Booking');

const lockMs = () => (parseInt(process.env.SEAT_LOCK_MINUTES, 10) || 5) * 60 * 1000;

const emitSeats = (io, showId, seatIds, status) => {
  if (io) io.to(`show:${showId}`).emit('seats:update', { showId: String(showId), seatIds: seatIds.map(String), status });
};

const refreshAvailable = async (showId) => {
  const available = await Seat.countDocuments({ show: showId, status: 'available' });
  await Show.updateOne({ _id: showId }, { availableSeats: available });
};

// Atomically lock seats for a user. Returns locked seat docs or throws on conflict.
exports.lockSeats = async ({ showId, seatIds, userId, io }) => {
  const now = new Date();
  const until = new Date(now.getTime() + lockMs());

  const res = await Seat.updateMany(
    {
      _id: { $in: seatIds },
      show: showId,
      $or: [
        { status: 'available' },
        { status: 'locked', lockedUntil: { $lt: now } },
        { status: 'locked', lockedBy: userId },
      ],
    },
    { $set: { status: 'locked', lockedBy: userId, lockedUntil: until } }
  );

  if (res.matchedCount !== seatIds.length) {
    // roll back anything we just touched in this request
    await Seat.updateMany(
      { _id: { $in: seatIds }, show: showId, lockedBy: userId, status: 'locked' },
      { $set: { status: 'available', lockedBy: null, lockedUntil: null } }
    );
    const err = new Error('One or more selected seats are no longer available');
    err.statusCode = 409;
    err.isOperational = true;
    throw err;
  }
  emitSeats(io, showId, seatIds, 'locked');
  return { lockedUntil: until };
};

exports.releaseSeats = async ({ showId, seatIds, userId, io }) => {
  await Seat.updateMany(
    { _id: { $in: seatIds }, show: showId, lockedBy: userId, status: 'locked' },
    { $set: { status: 'available', lockedBy: null, lockedUntil: null } }
  );
  emitSeats(io, showId, seatIds, 'available');
};

exports.markBooked = async ({ showId, seatIds, bookingId, io }) => {
  await Seat.updateMany(
    { _id: { $in: seatIds } },
    { $set: { status: 'booked', booking: bookingId, lockedUntil: null } }
  );
  await refreshAvailable(showId);
  emitSeats(io, showId, seatIds, 'booked');
};

exports.freeBooked = async ({ showId, seatIds, io }) => {
  await Seat.updateMany(
    { _id: { $in: seatIds } },
    { $set: { status: 'available', lockedBy: null, lockedUntil: null, booking: null } }
  );
  await refreshAvailable(showId);
  emitSeats(io, showId, seatIds, 'available');
};

// Background job: free expired locks and expire stale pending bookings.
exports.cleanupExpired = async (io) => {
  const now = new Date();
  const expiredSeats = await Seat.find({ status: 'locked', lockedUntil: { $lt: now } }).select('_id show');
  if (expiredSeats.length) {
    await Seat.updateMany(
      { _id: { $in: expiredSeats.map((s) => s._id) } },
      { $set: { status: 'available', lockedBy: null, lockedUntil: null } }
    );
    const byShow = expiredSeats.reduce((m, s) => ((m[s.show] = m[s.show] || []).push(s._id), m), {});
    Object.entries(byShow).forEach(([showId, ids]) => emitSeats(io, showId, ids, 'available'));
  }
  await Booking.updateMany({ status: 'pending', expiresAt: { $lt: now } }, { status: 'expired' });
  return expiredSeats.length;
};
