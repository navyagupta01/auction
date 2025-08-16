const { Auction, User, Bid } = require('../models/associations');
const cache = require('../services/cacheService');

const handleSocketConnection = (io) => {
  io.on('connection', (socket) => {
    console.log(`WebSocket client connected: ${socket.id}`);

    // Join specific auction room
    socket.on('join_auction', (auctionId) => {
      socket.join(`auction_${auctionId}`);
      socket.emit('joined_auction', { auctionId });
    });

    // Handle real-time bidding
    socket.on('place_bid', async (bidData) => {
      try {
        const { auctionId, amount, userId } = bidData;

        // Validate and create bid
        const auction = await Auction.findByPk(auctionId);
        if (parseFloat(amount) <= parseFloat(auction.currentPrice)) {
          socket.emit('bid_error', { message: 'Bid too low' });
          return;
        }

        const bid = await Bid.create({
          amount: parseFloat(amount),
          bidderId: userId,
          auctionId
        });

        auction.currentPrice = parseFloat(amount);
        await auction.save();

        // Cache updated data
        await cache.setAuction(auction);
        await cache.addBid(auctionId, bid);

        // Broadcast to all room participants
        io.to(`auction_${auctionId}`).emit('new_bid', {
          auctionId,
          amount: parseFloat(amount),
          bidderId: userId,
          timestamp: new Date()
        });

      } catch (error) {
        socket.emit('bid_error', { message: 'Bid failed' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`WebSocket client disconnected: ${socket.id}`);
    });
  });
};

module.exports = handleSocketConnection;
