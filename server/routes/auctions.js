const express = require('express');
const router = express.Router();
const { User, Auction, Bid } = require('../models/associations');
const { verifyToken } = require('../middleware/auth');

// Import multer upload middleware
let upload;
try {
  upload = require('../middleware/upload');
} catch (error) {
  console.log('Upload middleware not found, using empty middleware');
  upload = { array: () => (req, res, next) => next() };
}

// GET all auctions
router.get('/', async (req, res) => {
  try {
    console.log('📊 Fetching all auctions...');

    const auctions = await Auction.findAll({
      include: [
        { model: User, as: 'seller', attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    console.log('✅ Found auctions:', auctions.length);
    res.json(auctions);
  } catch (error) {
    console.error('❌ Get auctions error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET user's auctions (MUST be before /:id route)
router.get('/my', verifyToken, async (req, res) => {
  try {
    console.log('📊 Fetching user auctions for:', req.user.email);

    const auctions = await Auction.findAll({
      where: { sellerId: req.user.id },
      include: [
        { model: User, as: 'seller', attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    console.log('✅ Found user auctions:', auctions.length);
    res.json(auctions);
  } catch (error) {
    console.error('❌ Get user auctions error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET auction by ID (MUST be after specific routes like /my)
router.get('/:id', async (req, res) => {
  try {
    const auctionId = req.params.id;
    console.log('🔍 Looking for auction with ID:', auctionId);

    const auction = await Auction.findByPk(auctionId, {
      include: [
        { model: User, as: 'seller', attributes: ['id', 'name', 'email'] }
      ]
    });

    if (!auction) {
      console.error('❌ Auction not found with ID:', auctionId);
      return res.status(404).json({ message: 'Auction not found' });
    }

    console.log('✅ Auction found:', auction.title);
    res.json(auction);
  } catch (error) {
    console.error('❌ Get auction by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST create auction
router.post('/', verifyToken, upload.array('images', 5), async (req, res) => {
  try {
    const { title, description, startingPrice, currency, category, condition, duration } = req.body;

    console.log('🔨 Creating auction:', { title, sellerId: req.user.id });

    const endTime = new Date();
    endTime.setHours(endTime.getHours() + parseInt(duration) || 24);

    const images = req.files ? req.files.map(f => f.filename) : [];

    const auction = await Auction.create({
      sellerId: req.user.id,
      title,
      description,
      startingPrice: parseFloat(startingPrice),
      currentPrice: parseFloat(startingPrice),
      currency: currency || 'INR',
      category,
      condition,
      endTime,
      images,
      status: 'active'
    });

    console.log('✅ Auction created:', auction.id);
    res.status(201).json(auction);
  } catch (error) {
    console.error('❌ Create auction error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add test route for debugging
router.get('/test/debug', (req, res) => {
  res.json({
    message: 'Auction routes are working!',
    timestamp: new Date(),
    routes: ['GET /', 'GET /my', 'GET /:id', 'POST /']
  });
});

module.exports = router;
