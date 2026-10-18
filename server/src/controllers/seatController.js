const Show = require('../models/Show');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const seatService = require('../utils/seatService');

const MAX_SEATS = 8;

exports.lock = asyncHandler(async (req, res) => {
  const { showId, seatIds } = req.body;
  if (seatIds.length > MAX_SEATS) throw new AppError(`You can book at most ${MAX_SEATS} seats at a time`, 400);
  const show = await Show.findById(showId);
  if (!show || show.status !== 'scheduled') throw new AppError('Show not available', 404);
  if (show.startTime < new Date()) throw new AppError('This show has already started', 400);

  const result = await seatService.lockSeats({ showId, seatIds, userId: req.user._id, io: req.app.get('io') });
  res.json({ success: true, message: 'Seats locked', ...result });
});

exports.release = asyncHandler(async (req, res) => {
  const { showId, seatIds } = req.body;
  await seatService.releaseSeats({ showId, seatIds, userId: req.user._id, io: req.app.get('io') });
  res.json({ success: true, message: 'Seats released' });
});
