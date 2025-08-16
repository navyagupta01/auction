import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, List, ListItem, Alert } from '@mui/material';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';

const BiddingInterface = ({ auction }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [bids, setBids] = useState([]);
  const [error, setError] = useState('');
  const { socket } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (socket && auction) {
      socket.emit('join_auction', auction.id);

      socket.on('new_bid', (data) => {
        setBids(prev => [data, ...prev.slice(0, 9)]); // Keep last 10 bids
        setError('');
      });

      socket.on('bid_placed', () => {
        setBidAmount('');
        setError('');
      });

      socket.on('bid_error', (data) => {
        setError(data.message);
      });

      socket.on('auction_ended', (data) => {
        setError('Auction has ended');
      });

      return () => {
        socket.off('new_bid');
        socket.off('bid_placed');
        socket.off('bid_error');
        socket.off('auction_ended');
      };
    }
  }, [socket, auction]);

  const handlePlaceBid = () => {
    if (!bidAmount || parseFloat(bidAmount) <= auction.currentPrice) {
      setError('Bid must be higher than current price');
      return;
    }

    socket.emit('place_bid', {
      auctionId: auction.id,
      amount: parseFloat(bidAmount),
      userId: user.id
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Current Price: ₹{auction.currentPrice}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          type="number"
          label="Your Bid"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          size="small"
          inputProps={{ min: auction.currentPrice + 1 }}
        />
        <Button
          variant="contained"
          onClick={handlePlaceBid}
          disabled={auction.status !== 'active'}
        >
          Place Bid
        </Button>
      </Box>

      <Typography variant="subtitle1" gutterBottom>
        Recent Bids:
      </Typography>
      <List dense>
        {bids.map((bid, index) => (
          <ListItem key={index}>
            <Typography variant="body2">
              ₹{bid.amount} - {new Date(bid.timestamp).toLocaleTimeString()}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default BiddingInterface;
