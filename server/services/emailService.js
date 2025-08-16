const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWinnerEmail = async (winner, auction, winningBid) => {
  const msg = {
    to: winner.email,
    from: process.env.FROM_EMAIL,
    subject: `🎉 You Won the Auction: ${auction.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">🎉 Congratulations! You Won!</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
          <h3>${auction.title}</h3>
          <p><strong>Your Winning Bid:</strong> ₹${winningBid}</p>
          <p>Category: ${auction.category}</p>
          <p>Description: ${auction.description}</p>
        </div>
        <p style="margin-top: 20px;">Please contact the seller to complete the transaction.</p>
        <p>Thank you for using our auction platform!</p>
      </div>
    `,
    text: `Congratulations! You won the auction "${auction.title}" with a bid of ₹${winningBid}. Please contact the seller to complete the transaction.`
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Winner email sent to ${winner.email}`);
  } catch (error) {
    console.error('SendGrid Error:', error);
    throw error;
  }
};

const sendSellerEmail = async (seller, auction, winner, winningBid) => {
  const msg = {
    to: seller.email,
    from: process.env.FROM_EMAIL,
    subject: `Auction Ended: ${auction.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2196F3;">Your Auction Has Ended!</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
          <h3>${auction.title}</h3>
          <p><strong>Winner:</strong> ${winner.name}</p>
          <p><strong>Contact:</strong> ${winner.email}</p>
          <p><strong>Winning Bid:</strong> ₹${winningBid}</p>
        </div>
        <p style="margin-top: 20px;">Please contact the winner to complete the sale and arrange payment/delivery.</p>
        <p>Thank you for using our auction platform!</p>
      </div>
    `,
    text: `Your auction "${auction.title}" has ended! Winner: ${winner.name} (${winner.email}) with a bid of ₹${winningBid}. Please contact them to complete the sale.`
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Seller email sent to ${seller.email}`);
  } catch (error) {
    console.error('SendGrid Error:', error);
    throw error;
  }
};

const sendBidConfirmationEmail = async (bidder, auction, bidAmount) => {
  const msg = {
    to: bidder.email,
    from: process.env.FROM_EMAIL,
    subject: `Bid Confirmed: ${auction.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF9800;">Bid Confirmed!</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
          <h3>${auction.title}</h3>
          <p><strong>Your Bid:</strong> ₹${bidAmount}</p>
          <p><strong>Current Status:</strong> ${bidAmount >= auction.currentPrice ? 'Highest Bid' : 'Outbid'}</p>
        </div>
        <p style="margin-top: 20px;">Keep bidding to stay ahead!</p>
      </div>
    `,
    text: `Your bid of ₹${bidAmount} for "${auction.title}" has been confirmed.`
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Bid confirmation sent to ${bidder.email}`);
  } catch (error) {
    console.error('SendGrid Error:', error);
  }
};

module.exports = {
  sendWinnerEmail,
  sendSellerEmail,
  sendBidConfirmationEmail
};
