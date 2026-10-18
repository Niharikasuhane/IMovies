const router = require('express').Router();
const { body } = require('express-validator');
const c = require('../controllers/bookingController');
const { protect, restrictTo } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { bookingLimiter } = require('../middleware/rateLimiter');

router.use(protect);
router.post('/', bookingLimiter, [body('showId').isMongoId(), body('seatIds').isArray({ min: 1 }), body('seatIds.*').isMongoId()], validate, c.createBooking);
router.get('/my', c.getMyBookings);
router.get('/', restrictTo('admin'), c.getAllBookings);
router.get('/:id', c.getBooking);
router.put('/:id/cancel', c.cancelBooking);

module.exports = router;
