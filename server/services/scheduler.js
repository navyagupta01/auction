const cron = require('node-cron');
const { Op } = require('sequelize');
const { Auction, User, Bid } = require('../models/associations');
const { sendWinnerEmail, sendSellerEmail } = require('./emailService');

// Check every 5 minutes for expired auctions
const startAuctionScheduler = () => {
  cron.schedule('*/5 * * * *', async () => {
    console.log('🕐 Checking for expired auctions...');
    try {
      const expiredAuctions = await Auction.findAll({
        where: {
          status: 'active',
          endTime: { [Op.lt]: new Date() }
        },
        include: [{ model: User, as: 'seller' }]
      });

      console.log(`Found ${expiredAuctions.length} expired auctions`);

      for (const auction of expiredAuctions) {
        await endAuctionAutomatically(auction);
      }
    } catch (error) {
      console.error('❌ Scheduler error:', error);
    }
  });

  console.log('✅ Auction scheduler started');
};

const endAuctionAutomatically = async (auction) => {
  try {
    console.log(`🔚 Auto-ending auction: ${auction.title}`);

    // Find highest bidder
    const highestBid = await Bid.findOne({
      where: { auctionId: auction.id },
      order: [['amount', 'DESC']],
      include: [{ model: User, as: 'bidder' }]
    });

    auction.status = 'ended';

    if (highestBid) {
      auction.winnerId = highestBid.bidderId;

      // Send winner emails
      try {
        await sendWinnerEmail(highestBid.bidder, auction, highestBid.amount);
        await sendSellerEmail(auction.seller, auction, highestBid.bidder, highestBid.amount);
        console.log(`📧 Winner emails sent for auction: ${auction.title}`);
      } catch (emailError) {
        console.log('⚠️ Email sending failed:', emailError.message);
      }
    }

    await auction.save();
    console.log(`✅ Auto-ended auction: ${auction.title}`);

  } catch (error) {
    console.error(`❌ Error ending auction ${auction.id}:`, error);
  }
};

module.exports = { startAuctionScheduler };
