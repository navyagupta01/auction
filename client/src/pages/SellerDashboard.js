import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Card, CardContent, Button, Typography, Chip,
  Box, Alert, CircularProgress
} from '@mui/material';
import { EmojiEvents, AttachMoney, Schedule } from '@mui/icons-material';
import { auctionAPI } from '../services/api';

const SellerDashboard = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyAuctions();
  }, []);

  const fetchMyAuctions = async () => {
    try {
      const response = await auctionAPI.getUserAuctions();
      setAuctions(response.data);
    } catch (error) {
      setError('Failed to load auctions');
      console.error('Error fetching auctions:', error);
    } finally {
      setLoading(false);
    }
  };

  const endAuction = async (id) => {
    try {
      setLoading(true);
      await auctionAPI.endAuction(id);
      await fetchMyAuctions(); // Refresh list
      setError('');
    } catch (error) {
      setError('Failed to end auction');
      console.error('Error ending auction:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'ended': return 'default';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading your auctions...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        📊 My Auctions Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {auctions.map(auction => (
          <Grid item xs={12} md={6} lg={4} key={auction.id}>
            <Card sx={{ height: '100%', position: 'relative' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom noWrap>
                  {auction.title}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={auction.status.toUpperCase()}
                    color={getStatusColor(auction.status)}
                    size="small"
                  />
                </Box>

                <Typography color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AttachMoney sx={{ mr: 0.5 }} />
                  Current: ₹{auction.currentPrice}
                </Typography>

                <Typography color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Schedule sx={{ mr: 0.5 }} />
                  Ends: {new Date(auction.endTime).toLocaleDateString()}
                </Typography>

                {auction.winner && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                      <EmojiEvents sx={{ mr: 1, color: 'gold' }} />
                      Winner: {auction.winner.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {auction.winner.email}
                    </Typography>
                  </Box>
                )}

                {auction.status === 'active' && (
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => endAuction(auction.id)}
                    disabled={loading}
                  >
                    End Auction Now
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {auctions.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" color="text.secondary">
            You haven't created any auctions yet.
          </Typography>
          <Button variant="contained" sx={{ mt: 2 }}>
            Create Your First Auction
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default SellerDashboard;
