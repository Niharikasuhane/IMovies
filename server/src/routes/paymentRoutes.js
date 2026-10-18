const router = require('express').Router();
const { body } = require('express-validator');
const c = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { bookingLimiter } = require('../middleware/rateLimiter');

router.use(protect);
router.post('/pay', bookingLimiter, [
  body('bookingId').isMongoId(),
  body('method').optional().isIn(['card', 'upi', 'netbanking', 'wallet']),
], validate, c.pay);
router.get('/my', c.getMyPayments);

module.exports = router;
