import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Chip,
  Divider
} from '@mui/material';
import {
  Gavel,
  TrendingUp,
  Warning
} from '@mui/icons-material';

const BidConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  auction,
  suggestedBid,
  loading
}) => {
  const [bidAmount, setBidAmount] = useState(suggestedBid || '');
  const [error, setError] = useState('');

  const formatPrice = (price, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency
    }).format(price);
  };

  const handleBidChange = (event) => {
    const value = parseFloat(event.target.value) || 0;
    setBidAmount(value);

    if (value <= parseFloat(auction.currentPrice)) {
      setError(`Bid must be higher than current price ${formatPrice(auction.currentPrice)}`);
    } else {
      setError('');
    }
  };

  const handleConfirmBid = () => {
    const amount = parseFloat(bidAmount);
    if (amount <= parseFloat(auction.currentPrice)) {
      setError('Bid amount is too low');
      return;
    }
    onConfirm(amount);
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', pb: 2 }}>
        <Gavel sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
        <Typography variant="h5" fontWeight="bold">
          Place Your Bid
        </Typography>
      </DialogTitle>

      <DialogContent>
        {/* Auction Info */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            {auction.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip label={auction.category} variant="outlined" size="small" />
            <Chip label={auction.condition} variant="outlined" size="small" />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Current Price:
            </Typography>
            <Typography variant="h6" color="secondary.main" fontWeight="bold">
              {formatPrice(auction.currentPrice, auction.currency)}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Bid Amount Input */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="medium">
            Your Bid Amount
          </Typography>
          <TextField
            fullWidth
            type="number"
            label="Enter bid amount"
            value={bidAmount}
            onChange={handleBidChange}
            error={!!error}
            helperText={error || `Minimum bid: ${formatPrice(parseFloat(auction.currentPrice) + 1)}`}
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
            }}
            sx={{ mb: 2 }}
          />
        </Box>

        {/* Warning */}
        <Alert severity="info" sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Warning sx={{ mr: 1 }} />
            <Typography variant="body2">
              By confirming, you agree to purchase this item if you win the auction.
            </Typography>
          </Box>
        </Alert>

        {/* Bid Summary */}
        <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1" fontWeight="medium">
              Your Bid:
            </Typography>
            <Typography variant="h5" color="primary.main" fontWeight="bold">
              {formatPrice(bidAmount || 0, auction.currency)}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          size="large"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirmBid}
          variant="contained"
          size="large"
          disabled={loading || !!error || !bidAmount}
          startIcon={loading ? undefined : <TrendingUp />}
          sx={{ minWidth: 120 }}
        >
          {loading ? 'Placing Bid...' : 'Confirm Bid'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BidConfirmationModal;
