const router = require('express').Router();
const { body } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const c = require('../controllers/showController');
const { protect, restrictTo } = require('../middleware/auth');
const validate = require('../middleware/validate');

// Optional auth: lets us flag seats held by the current user
const optionalAuth = async (req, res, next) => {
  try {
    const h = req.headers.authorization;
    if (h && h.startsWith('Bearer ')) {
      const decoded = jwt.verify(h.split(' ')[1], process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    }
  } catch (e) { /* ignore */ }
  next();
};

router.get('/', c.getShows);
router.get('/:id', c.getShow);
router.get('/:id/seats', optionalAuth, c.getSeats);

router.post('/', protect, restrictTo('admin'), [
  body('movie').isMongoId(), body('theatre').isMongoId(),
  body('screenName').notEmpty(),
  body('startTime').isISO8601().custom((v) => new Date(v) > new Date()).withMessage('Start time must be in the future'),
  body('price.regular').isFloat({ min: 0 }), body('price.premium').isFloat({ min: 0 }),
], validate, c.createShow);
router.put('/:id', protect, restrictTo('admin'), c.updateShow);
router.delete('/:id', protect, restrictTo('admin'), c.deleteShow);

module.exports = router;
