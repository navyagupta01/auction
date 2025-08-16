import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Card, CardContent, Button, Typography, Chip,
  Box, Alert, CircularProgress, Paper
} from '@mui/material';
import { EmojiEvents, AttachMoney, Schedule, TrendingUp } from '@mui/icons-material';
import { auctionAPI, analyticsAPI } from '../services/api';

const SellerDashboard = () => {
  const [auctions, setAuctions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetchMyAuctions(),
      fetchStats()
    ]);
  }, []);

  const fetchMyAuctions = async () => {
    try {
      const response = await auctionAPI.getUserAuctions();
      setAuctions(response.data);
    } catch (error) {
      setError('Failed to load auctions');
      console.error('Error fetching auctions:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await analyticsAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const endAuction = async (id) => {
    try {
      setLoading(true);
      await auctionAPI.endAuction(id);
      await Promise.all([fetchMyAuctions(), fetchStats()]);
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

  if (loading && !auctions.length) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading dashboard...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        📊 Seller Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light' }}>
              <Typography variant="h4" color="primary.main">
                {stats.totalAuctions}
              </Typography>
              <Typography color="primary.main">Total Auctions</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light' }}>
              <Typography variant="h4" color="success.main">
                {stats.activeAuctions}
              </Typography>
              <Typography color="success.main">Active</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light' }}>
              <Typography variant="h4" color="info.main">
                {stats.completedSales}
              </Typography>
              <Typography color="info.main">Completed Sales</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light' }}>
              <Typography variant="h4" color="warning.main">
                ₹{stats.totalRevenue?.toLocaleString() || 0}
              </Typography>
              <Typography color="warning.main">Total Revenue</Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Auctions Grid */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        My Auctions
      </Typography>

      <Grid container spacing={3}>
        {auctions.map(auction => (
          <Grid item xs={12} md={6} lg={4} key={auction.id}>
            <Card sx={{ height: '100%' }}>
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
                  Current: ₹{auction.currentPrice?.toLocaleString()}
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
