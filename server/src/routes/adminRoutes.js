const router = require('express').Router();
const c = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect, restrictTo('admin'));
router.get('/stats', c.stats);
router.get('/users', c.getUsers);
router.put('/users/:id/toggle', c.toggleUser);

module.exports = router;
