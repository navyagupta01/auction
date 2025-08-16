import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardMedia,
  Box,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress,
  Button,
  Snackbar
} from '@mui/material';
import {
  Gavel,
  AccessTime,
  Person,
  TrendingUp,
  CheckCircle
} from '@mui/icons-material';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import { auctionAPI } from '../services/api';
import BidConfirmationModal from '../components/BidConfirmationModal';

const AuctionDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { socket, connected, joinAuction, leaveAuction } = useSocket();

  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bids, setBids] = useState([]);
  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [placingBid, setPlacingBid] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchAuction();
  }, [id]);

  useEffect(() => {
    console.log('🔍 Socket status:', { socket: !!socket, connected, user: !!user });

    if (socket && id && connected) {
      console.log('🏠 Joining auction:', id);
      joinAuction(id);

      socket.on('new_bid', (bidData) => {
        if (bidData.auctionId === id) {
          console.log('✅ New bid received:', bidData);

          setAuction(prev => ({
            ...prev,
            currentPrice: bidData.amount
          }));

          setBids(prev => [{
            amount: bidData.amount,
            bidder: bidData.bidder,
            timestamp: bidData.timestamp
          }, ...prev]);

          if (bidData.bidder.id === user?.id) {
            setSuccessMessage('✅ Bid placed successfully!');
            setPlacingBid(false);
          }
        }
      });

      socket.on('bid_error', (error) => {
        console.error('❌ Bid error received:', error);
        setError(error.message);
        setPlacingBid(false);
      });

      return () => {
        leaveAuction(id);
        socket.off('new_bid');
        socket.off('bid_error');
      };
    }
  }, [socket, id, user, connected]);

  const fetchAuction = async () => {
    try {
      const response = await auctionAPI.getById(id);
      setAuction(response.data);
    } catch (error) {
      setError('Failed to load auction');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency
    }).format(price);
  };

  const getTimeRemaining = () => {
    if (!auction) return 'Loading...';

    const now = new Date();
    const end = new Date(auction.endTime);
    const diff = end - now;

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h ${minutes}m left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  const handlePlaceBidClick = () => {
    if (!user) {
      setError('Please login to place a bid');
      return;
    }

    if (!connected) {
      setError('Not connected to server. Please refresh and try again.');
      return;
    }

    setBidModalOpen(true);
    setError('');
  };

  const handleConfirmBid = async (amount) => {
    console.log('🔨 Placing bid:', { auctionId: id, amount, userId: user.id });

    setPlacingBid(true);
    setError('');

    try {
      if (!socket || !connected) {
        throw new Error('Not connected to server. Please refresh and try again.');
      }

      socket.emit('place_bid', {
        auctionId: id,
        amount,
        userId: user.id,
        userEmail: user.email
      });

      setBidModalOpen(false);

    } catch (error) {
      console.error('❌ Bid placement error:', error);
      setError(error.message || 'Failed to place bid. Please try again.');
      setPlacingBid(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading auction details...
        </Typography>
      </Container>
    );
  }

  if (error && !auction) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const suggestedBid = parseFloat(auction.currentPrice) + 100;
  const canBid = auction.status === 'active' && user && user.id !== auction.sellerId;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Main Auction Details */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            {/* Title and Status */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h4" gutterBottom>
                {auction.title}
              </Typography>
              <Chip
                label={auction.status}
                color={auction.status === 'active' ? 'success' : 'default'}
                icon={auction.status === 'active' ? <TrendingUp /> : undefined}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <Chip label={auction.category} variant="outlined" />
              <Chip label={auction.condition} variant="outlined" />
            </Box>

            {/* Image */}
            {auction.images && auction.images.length > 0 ? (
              <Card sx={{ mb: 3 }}>
                <CardMedia
                  component="img"
                  height="400"
                  image={`http://localhost:5000/uploads/${auction.images[0]}`}
                  alt={auction.title}
                  sx={{ objectFit: 'cover' }}
                />
              </Card>
            ) : (
              <Box
                sx={{
                  height: 400,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.100',
                  borderRadius: 2,
                  mb: 3
                }}
              >
                <Gavel sx={{ fontSize: 80, color: 'grey.400' }} />
              </Box>
            )}

            {/* Description */}
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {auction.description || 'No description provided'}
            </Typography>

            {/* Current Price & Time */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <Paper elevation={1} sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.light' }}>
                  <Typography variant="h6" color="primary.main" gutterBottom>
                    Current Price
                  </Typography>
                  <Typography variant="h3" color="primary.main" fontWeight="bold">
                    {formatPrice(auction.currentPrice, auction.currency)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper elevation={1} sx={{ p: 3, textAlign: 'center', bgcolor: 'success.light' }}>
                  <Typography variant="h6" color="success.main" gutterBottom>
                    Time Remaining
                  </Typography>
                  <Typography variant="h4" color="success.main" fontWeight="bold">
                    {getTimeRemaining()}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* **THIS IS THE MAIN BID BUTTON SECTION** */}
            {canBid && (
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handlePlaceBidClick}
                  disabled={!connected || auction.status !== 'active' || placingBid}
                  startIcon={placingBid ? <CircularProgress size={20} /> : <Gavel />}
                  sx={{
                    px: 6,
                    py: 3,
                    fontSize: '1.5rem',
                    minWidth: 250,
                    borderRadius: 2,
                    boxShadow: 3,
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  {placingBid ? 'Placing Bid...' : 'Place Bid'}
                </Button>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2, fontSize: '1.1rem' }}>
                  Suggested bid: {formatPrice(suggestedBid, auction.currency)}
                </Typography>
              </Box>
            )}

            {/* User cannot bid messages */}
            {!user && (
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Alert severity="info">
                  Please login to place a bid on this auction.
                </Alert>
              </Box>
            )}

            {user && user.id === auction.sellerId && (
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Alert severity="warning">
                  You cannot bid on your own auction.
                </Alert>
              </Box>
            )}

            {auction.status === 'ended' && (
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Alert severity="error">
                  This auction has ended.
                </Alert>
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* Bid History Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp sx={{ mr: 1 }} />
                Bid History ({bids.length})
              </Box>
            </Typography>

            <List>
              {bids.length === 0 ? (
                <ListItem>
                  <ListItemText
                    primary="No bids yet"
                    secondary="Be the first to bid!"
                  />
                </ListItem>
              ) : (
                bids.map((bid, index) => (
                  <ListItem key={index} divider={index < bids.length - 1}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: index === 0 ? 'success.main' : 'grey.400' }}>
                        {index === 0 ? <CheckCircle /> : <Person />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={formatPrice(bid.amount)}
                      secondary={
                        <Box>
                          <Typography variant="body2" component="span">
                            {bid.bidder.name}
                          </Typography>
                          <br />
                          <Typography variant="caption" color="text.secondary">
                            {new Date(bid.timestamp).toLocaleString()}
                          </Typography>
                        </Box>
                      }
                    />
                    {index === 0 && (
                      <Chip label="Highest Bid" color="success" size="small" />
                    )}
                  </ListItem>
                ))
              )}
            </List>

            {/* Connection Status */}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Chip
                label={connected ? 'Live Updates Active' : 'Connecting...'}
                color={connected ? 'success' : 'warning'}
                size="small"
                icon={connected ? <CheckCircle /> : <AccessTime />}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Bid Confirmation Modal */}
      <BidConfirmationModal
        open={bidModalOpen}
        onClose={() => setBidModalOpen(false)}
        onConfirm={handleConfirmBid}
        auction={auction}
        suggestedBid={suggestedBid}
        loading={placingBid}
      />

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AuctionDetail;
