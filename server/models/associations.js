const User = require('./User');
const Auction = require('./Auction');
const Bid = require('./Bid');

// User associations
User.hasMany(Auction, { foreignKey: 'sellerId', as: 'auctions' });
User.hasMany(Bid, { foreignKey: 'bidderId', as: 'bids' });

// Auction associations
Auction.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });
Auction.belongsTo(User, { foreignKey: 'winnerId', as: 'winner' });
Auction.hasMany(Bid, { foreignKey: 'auctionId', as: 'bids' });

// Bid associations
Bid.belongsTo(User, { foreignKey: 'bidderId', as: 'bidder' });
Bid.belongsTo(Auction, { foreignKey: 'auctionId', as: 'auction' });

module.exports = { User, Auction, Bid };
