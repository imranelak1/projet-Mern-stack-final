const express = require('express');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');
const { getAnalytics } = require('../controllers/analyticsController');

const router = express.Router();

// Protect analytics routes with authentication and admin middleware
router.use(requireAuth);
router.use(requireAdmin);

router.get('/analytics', getAnalytics);

module.exports = router;
