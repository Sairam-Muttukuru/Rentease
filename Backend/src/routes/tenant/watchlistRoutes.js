const express = require('express');
const router = express.Router();
const WatchlistController = require('../../controllers/tenant/WatchlistController');
const authenticateToken = require('../../middlewares/AuthMiddleware');

router.post('/', authenticateToken, WatchlistController.toggleWatchlist);
router.get('/', authenticateToken, WatchlistController.getWatchlist);
router.get('/status/:propertyId', authenticateToken, WatchlistController.checkStatus);

module.exports = router;
