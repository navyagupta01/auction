const Auction = require('../models/Auction');
const Bid = require('../models/Bid');

exports.getAllAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({})
      .populate('seller', 'name email')
      .populate('bids')
      .sort({ createdAt: -1 });
    res.json(auctions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate('seller', 'name email')
      .populate({
        path: 'bids',
        populate: { path: 'bidder', select: 'name email' }
      });

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    res.json(auction);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createAuction = async (req, res) => {
  try {
    const { title, description, startingPrice, endTime, images } = req.body;

    const auction = new Auction({
      title,
      description,
      startingPrice,
      currentPrice: startingPrice,
      status: 'active',
      seller: req.user.id,
      startTime: new Date(),
      endTime: new Date(endTime),
      images: images || [],
      bids: []
    });

    await auction.save();
    await auction.populate('seller', 'name email');

    res.status(201).json(auction);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUserAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({ seller: req.user.id })
      .populate('bids')
      .sort({ createdAt: -1 });
    res.json(auctions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
