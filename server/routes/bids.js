const express = require('express');
const router = express.Router();
const bidController = require('../controllers/bidController');
const { verifyToken } = require('../middleware/auth');

// POST /api/bids/:auctionId (place bid)
router.post('/:auctionId', verifyToken, bidController.placeBid);

// GET /api/bids/:auctionId (get bid history)
router.get('/:auctionId', bidController.getBidHistory);

module.exports = router;
