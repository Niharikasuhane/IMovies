const router = require('express').Router();
const c = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', c.getMine);
router.put('/read-all', c.markAllRead);

module.exports = router;
