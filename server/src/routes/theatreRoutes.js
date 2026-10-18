const router = require('express').Router();
const { body } = require('express-validator');
const c = require('../controllers/theatreController');
const { protect, restrictTo } = require('../middleware/auth');
const validate = require('../middleware/validate');

const rules = [
  body('name').trim().notEmpty(),
  body('city').trim().notEmpty(),
  body('address').trim().notEmpty(),
  body('screens').isArray({ min: 1 }).withMessage('At least one screen required'),
  body('screens.*.name').notEmpty(),
  body('screens.*.rows').isInt({ min: 1, max: 26 }),
  body('screens.*.seatsPerRow').isInt({ min: 1, max: 40 }),
];

router.get('/', c.getTheatres);
router.get('/:id', c.getTheatre);
router.post('/', protect, restrictTo('admin'), rules, validate, c.createTheatre);
router.put('/:id', protect, restrictTo('admin'), c.updateTheatre);
router.delete('/:id', protect, restrictTo('admin'), c.deleteTheatre);

module.exports = router;
