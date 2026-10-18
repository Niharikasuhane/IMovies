const router = require('express').Router();
const { body } = require('express-validator');
const c = require('../controllers/seatController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { bookingLimiter } = require('../middleware/rateLimiter');

const rules = [body('showId').isMongoId(), body('seatIds').isArray({ min: 1 }), body('seatIds.*').isMongoId()];

router.post('/lock', protect, bookingLimiter, rules, validate, c.lock);
router.post('/release', protect, rules, validate, c.release);

module.exports = router;
