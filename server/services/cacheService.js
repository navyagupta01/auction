const redis = require('../config/redis');

class CacheService {
  async setAuction(auction) {
    try {
      await redis.setEx(`auction:${auction.id}`, 300, JSON.stringify(auction));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async getAuction(id) {
    try {
      const raw = await redis.get(`auction:${id}`);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async addBid(auctionId, bid) {
    try {
      await redis.zAdd(`bids:${auctionId}`, {
        score: bid.amount,
        value: JSON.stringify(bid)
      });
    } catch (error) {
      console.error('Cache bid error:', error);
    }
  }

  async topBid(auctionId) {
    try {
      const result = await redis.zRangeByScoreWithScores(`bids:${auctionId}`, '-inf', '+inf', {
        LIMIT: { offset: 0, count: 1 },
        REV: true
      });
      return result.length > 0 ? JSON.parse(result[0].value) : null;
    } catch (error) {
      console.error('Cache top bid error:', error);
      return null;
    }
  }
}

module.exports = new CacheService();
