const router = require('express').Router();
const { body, param } = require('express-validator');
const c = require('../controllers/movieController');
const { protect, restrictTo } = require('../middleware/auth');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');

const movieRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('language').trim().notEmpty().withMessage('Language is required'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive number'),
  body('releaseDate').isISO8601().withMessage('Valid release date required'),
  body('rating').optional({ checkFalsy: true }).isFloat({ min: 0, max: 10 }),
];

router.get('/', c.getMovies);
router.get('/filters', c.getFilters);
router.get('/:id', param('id').isMongoId(), validate, c.getMovie);

router.post('/', protect, restrictTo('admin'), upload.single('poster'), movieRules, validate, c.createMovie);
router.put('/:id', protect, restrictTo('admin'), upload.single('poster'), param('id').isMongoId(), validate, c.updateMovie);
router.delete('/:id', protect, restrictTo('admin'), param('id').isMongoId(), validate, c.deleteMovie);

module.exports = router;
