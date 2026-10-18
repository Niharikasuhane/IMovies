const crypto = require('crypto');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const seatService = require('../utils/seatService');
const notify = require('../utils/notify');

/**
 * Mock payment gateway. Replace `chargeGateway` with Razorpay/Stripe in production.
 * Test rules: card number ending "0000" => failure; everything else => success.
 */
const chargeGateway = async ({ method, cardNumber, amount }) => {
  if (method === 'card' && String(cardNumber || '').replace(/\s/g, '').endsWith('0000')) {
    return { ok: false, reason: 'Card declined by bank' };
  }
  return { ok: true, transactionId: 'TXN' + crypto.randomBytes(6).toString('hex').toUpperCase() };
};

exports.pay = asyncHandler(async (req, res) => {
  const { bookingId, method = 'card', cardNumber } = req.body;
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new AppError('Booking not found', 404);
  if (String(booking.user) !== String(req.user._id)) throw new AppError('Forbidden', 403);
  if (booking.status === 'confirmed') throw new AppError('Booking already paid', 400);
  if (booking.status !== 'pending') throw new AppError(`Booking is ${booking.status}. Please start again.`, 400);
  if (booking.expiresAt < new Date()) {
    booking.status = 'expired';
    await booking.save();
    throw new AppError('Seat hold expired. Please select seats again.', 410);
  }

  const result = await chargeGateway({ method, cardNumber, amount: booking.totalAmount });
  const io = req.app.get('io');

  if (!result.ok) {
    const payment = await Payment.create({
      booking: booking._id, user: req.user._id, amount: booking.totalAmount, method,
      status: 'failed', failureReason: result.reason,
    });
    await notify(req.user._id, 'Payment failed', `Payment for ${booking.bookingCode} failed: ${result.reason}. You can retry before the seat hold expires.`, 'payment');
    return res.status(402).json({ success: false, message: result.reason, data: { paymentId: payment._id } });
  }

  const payment = await Payment.create({
    booking: booking._id, user: req.user._id, amount: booking.totalAmount, method,
    status: 'success', transactionId: result.transactionId,
  });
  booking.status = 'confirmed';
  booking.payment = payment._id;
  booking.expiresAt = undefined;
  await booking.save();
  await seatService.markBooked({ showId: booking.show, seatIds: booking.seats, bookingId: booking._id, io });
  await notify(req.user._id, 'Booking confirmed', `Booking ${booking.bookingCode} confirmed. Seats: ${booking.seatLabels.join(', ')}.`, 'booking');
  res.json({ success: true, message: 'Payment successful', data: { booking, payment } });
});

exports.getMyPayments = asyncHandler(async (req, res) => {
  const data = await Payment.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.json({ success: true, data });
});
