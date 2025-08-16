const Auction = require('../models/Auction');
const Bid = require('../models/Bid');

exports.placeBid = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const { amount } = req.body;
    const bidderId = req.user.id;

    // Find auction
    const auction = await Auction.findById(auctionId).populate('bids');
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    // Check if auction is active
    if (auction.status !== 'active') {
      return res.status(400).json({ message: 'Auction is not active' });
    }

    // Check if auction has ended
    if (new Date() > auction.endTime) {
      return res.status(400).json({ message: 'Auction has ended' });
    }

    // Check if bid amount is higher than current price
    if (amount <= auction.currentPrice) {
      return res.status(400).json({
        message: `Bid must be higher than current price of $${auction.currentPrice}`
      });
    }

    // Check if bidder is not the seller
    if (auction.seller.toString() === bidderId) {
      return res.status(400).json({ message: 'Cannot bid on your own auction' });
    }

    // Create new bid
    const bid = new Bid({
      auction: auctionId,
      bidder: bidderId,
      amount: amount
    });

    await bid.save();
    await bid.populate('bidder', 'name email');

    // Update auction
    auction.currentPrice = amount;
    auction.bids.push(bid._id);
    await auction.save();

    // Emit real-time event (if you have socket.io set up)
    const io = req.app.get('io');
    if (io) {
      io.to(auctionId).emit('bidPlaced', {
        auctionId,
        bid: {
          _id: bid._id,
          amount: bid.amount,
          bidder: bid.bidder,
          createdAt: bid.createdAt
        },
        newCurrentPrice: amount
      });
    }

    res.status(201).json({
      message: 'Bid placed successfully',
      bid: bid,
      newCurrentPrice: amount
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getBidHistory = async (req, res) => {
  try {
    const { auctionId } = req.params;

    const bids = await Bid.find({ auction: auctionId })
      .populate('bidder', 'name email')
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
