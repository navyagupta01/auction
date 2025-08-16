exports.validateAuctionInput = (data) => {
  if (!data.title || !data.startingPrice || !data.endTime) return false;
  if (isNaN(data.startingPrice)) return false;
  // Add further validation checks as you go
  return true;
};
