const schedule = require('node-schedule');

// Schedules a job to run at a given date
const scheduleAuctionEnd = (auctionId, endDate, callback) => {
  schedule.scheduleJob(`${auctionId}_end`, endDate, callback);
};

module.exports = { scheduleAuctionEnd };
