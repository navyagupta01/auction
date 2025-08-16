import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Button,
  Box,
  CircularProgress
} from '@mui/material';
import {
  Gavel,
  TrendingUp,
  EmojiEvents,
  AttachMoney,
  AccessTime
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auctionAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [myAuctions, setMyAuctions] = useState([]);
  const [allAuctions, setAllAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    created: 0,
    active: 0,
    ended: 0,
    totalValue: 0
  });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch user's auctions
      const myResponse = await auctionAPI.getUserAuctions();
      const userAuctions = myResponse.data;
      setMyAuctions(userAuctions);

      // Fetch all auctions for recent activity
      const allResponse = await auctionAPI.getAll();
      setAllAuctions(allResponse.data.slice(0, 5)); // Get latest 5

      // Calculate stats
      const activeAuctions = userAuctions.filter(a => a.status === 'active').length;
      const endedAuctions = userAuctions.filter(a => a.status === 'ended').length;
      const totalValue = userAuctions.reduce((sum, a) => sum + parseFloat(a.currentPrice || 0), 0);

      setStats({
        created: userAuctions.length,
        active: activeAuctions,
        ended: endedAuctions,
        totalValue: totalValue
      });

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
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

  const getTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Please Login to View Dashboard
          </Typography>
          <Button variant="contained" component={Link} to="/login" sx={{ mt: 2 }}>
            Login
          </Button>
        </Paper>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your dashboard...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Welcome Header */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h3" gutterBottom>
          Welcome back, {user.name}!
        </Typography>
        <Typography variant="h6">
          Here's your auction activity overview
        </Typography>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Gavel sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" color="primary">
                {stats.created}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Created
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" color="success.main">
                {stats.active}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Now
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <EmojiEvents sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" color="warning.main">
                {stats.ended}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <AttachMoney sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
              <Typography variant="h4" color="secondary.main">
                {formatPrice(stats.totalValue)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Value
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<Gavel />}
              component={Link}
              to="/create"
              size="large"
            >
              Create New Auction
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<TrendingUp />}
              component={Link}
              to="/auctions"
              size="large"
            >
              Browse Auctions
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              component={Link}
              to="/profile"
              size="large"
            >
              View Profile
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={4}>
        {/* My Recent Auctions */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              My Recent Auctions ({myAuctions.length})
            </Typography>

            {myAuctions.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Gavel sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  You haven't created any auctions yet
                </Typography>
                <Button
                  variant="contained"
                  component={Link}
                  to="/create"
                  sx={{ mt: 2 }}
                >
                  Create Your First Auction
                </Button>
              </Box>
            ) : (
              <List>
                {myAuctions.slice(0, 5).map((auction) => (
                  <ListItem key={auction.id} divider>
                    <ListItemAvatar>
                      <Avatar
                        src={
                          auction.images?.length > 0
                            ? `${process.env.REACT_APP_API_URL || window.location.origin}/uploads/${auction.images[0]}`
                            : undefined
                        }
                        sx={{ bgcolor: 'primary.main' }}
                      >
                        <Gavel />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={auction.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {formatPrice(auction.currentPrice, auction.currency)}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Chip
                              label={auction.status}
                              color={auction.status === 'active' ? 'success' : 'default'}
                              size="small"
                            />
                            {auction.status === 'active' && (
                              <Chip
                                label={getTimeRemaining(auction.endTime)}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}

                {myAuctions.length > 5 && (
                  <ListItem>
                    <Button
                      color="primary"
                      fullWidth
                      component={Link}
                      to="/profile"
                    >
                      View All {myAuctions.length} Auctions
                    </Button>
                  </ListItem>
                )}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Platform Activity
            </Typography>

            <List>
              {allAuctions.map((auction) => (
                <ListItem key={auction.id} divider>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      <AccessTime />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`New auction: ${auction.title}`}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Starting at {formatPrice(auction.startingPrice, auction.currency)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          by {auction.seller?.name || 'Anonymous'}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>

            <Button
              component={Link}
              to="/auctions"
              color="primary"
              sx={{ mt: 2 }}
              fullWidth
            >
              Browse All Auctions
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
