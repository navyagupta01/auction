let io;

const initSocket = (server) => {
  const { Server } = require('socket.io');
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST']
    }
  });
};

const emitBidPlaced = (auctionId, bid) => {
  if (io) io.to(auctionId).emit('bidPlaced', bid);
};

const emitAuctionEnded = (auctionId, auctionData) => {
  if (io) io.to(auctionId).emit('auctionEnded', auctionData);
};

module.exports = { initSocket, emitBidPlaced, emitAuctionEnded };
