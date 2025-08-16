const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { User, Auction, Bid } = require('../models/associations');
const { verifyToken } = require('../middleware/auth');

// GET /api/analytics/stats (seller stats)
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const sellerId = req.user.id;

    const stats = {
      totalAuctions: await Auction.count({
        where: { sellerId }
      }),
      activeAuctions: await Auction.count({
        where: { sellerId, status: 'active' }
      }),
      completedSales: await Auction.count({
        where: {
          sellerId,
          status: 'ended',
          winnerId: { [Op.not]: null }
        }
      }),
      totalRevenue: await Auction.sum('currentPrice', {
        where: { sellerId, status: 'ended' }
      }) || 0,
      totalBids: await Bid.count({
        include: [{
          model: Auction,
          where: { sellerId }
        }]
      })
    };

    console.log('📊 Analytics stats for user:', req.user.email, stats);
    res.json(stats);
  } catch (error) {
    console.error('❌ Analytics error:', error);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
});

// GET /api/analytics/revenue (monthly revenue)
router.get('/revenue', verifyToken, async (req, res) => {
  try {
    const sellerId = req.user.id;

    const revenueData = await Auction.findAll({
      where: {
        sellerId,
        status: 'ended',
        winnerId: { [Op.not]: null }
      },
      attributes: ['currentPrice', 'createdAt', 'title'],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    res.json(revenueData);
  } catch (error) {
    console.error('❌ Revenue analytics error:', error);
    res.status(500).json({ message: 'Error fetching revenue data' });
  }
});

module.exports = router;
