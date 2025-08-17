import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Paper,
  Chip,
  Avatar,
  Rating
} from '@mui/material';
import {
  Gavel,
  TrendingUp,
  Security,
  Speed,
  People,
  Star,
  AccessTime
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { auctionAPI } from '../services/api';

const Home = () => {
  const { user } = useAuth();
  const [featuredAuctions, setFeaturedAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedAuctions();
  }, []);

  const fetchFeaturedAuctions = async () => {
    try {
      const response = await auctionAPI.getAll();
      // Get first 3 active auctions as featured
      const featured = response.data
        .filter(auction => auction.status === 'active')
        .slice(0, 3);
      setFeaturedAuctions(featured);
    } catch (error) {
      console.error('Failed to fetch featured auctions:', error);
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

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
          background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Welcome to AuctioneerX
          </Typography>
          <Typography variant="h5" paragraph sx={{ mb: 4 }}>
            Discover amazing items, place winning bids, and sell your treasures
            in our secure real-time auction platform
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/auctions"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': { bgcolor: 'grey.100' }
              }}
              startIcon={<Gavel />}
            >
              Browse Auctions
            </Button>

            {user ? (
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/create"
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                }}
                startIcon={<TrendingUp />}
              >
                Create Auction
              </Button>
            ) : (
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/register"
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                Get Started
              </Button>
            )}
          </Box>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" gutterBottom>
          Why Choose AuctioneerX?
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
          Experience the future of online auctions with our cutting-edge features
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 4, textAlign: 'center', height: '100%' }}>
              <Speed sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Real-Time Bidding
              </Typography>
              <Typography color="text.secondary">
                Watch bids update instantly with WebSocket technology.
                Never miss a beat in live auctions.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 4, textAlign: 'center', height: '100%' }}>
              <Security sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Secure & Trusted
              </Typography>
              <Typography color="text.secondary">
                Your transactions are protected with bank-level security.
                Bid and sell with confidence.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 4, textAlign: 'center', height: '100%' }}>
              <People sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Community Driven
              </Typography>
              <Typography color="text.secondary">
                Join thousands of buyers and sellers in our thriving
                auction community.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Featured Auctions Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" gutterBottom>
            Featured Auctions
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
            Don't miss these exciting opportunities
          </Typography>

          {loading ? (
            <Box textAlign="center">
              <Typography>Loading featured auctions...</Typography>
            </Box>
          ) : featuredAuctions.length === 0 ? (
            <Paper elevation={1} sx={{ p: 6, textAlign: 'center' }}>
              <Gavel sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                No active auctions right now
              </Typography>
              <Typography color="text.secondary" paragraph>
                Be the first to create an auction and start the excitement!
              </Typography>
              {user && (
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  to="/create"
                  startIcon={<Gavel />}
                >
                  Create First Auction
                </Button>
              )}
            </Paper>
          ) : (
            <>
              <Grid container spacing={4} sx={{ mb: 4 }}>
                {featuredAuctions.map((auction) => (
                  <Grid item xs={12} sm={6} md={4} key={auction.id}>
                    <Card
                      elevation={3}
                      sx={{
                        height: '100%',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-4px)' }
                      }}
                    >
                      {auction.images && auction.images.length > 0 ? (
                        <CardMedia
                          component="img"
                          height="200"
                          image={`${process.env.REACT_APP_API_URL || window.location.origin}/uploads/${auction.images[0]}`}
                          alt={auction.title}
                        />
                      ) : (
                        <Box
                          sx={{
                            height: 200,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'grey.200'
                          }}
                        >
                          <Gavel sx={{ fontSize: 60, color: 'grey.400' }} />
                        </Box>
                      )}

                      <CardContent>
                        <Typography variant="h6" gutterBottom noWrap>
                          {auction.title}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                          <Chip
                            label="Live"
                            color="success"
                            size="small"
                            icon={<AccessTime />}
                          />
                          <Chip
                            label={auction.category}
                            variant="outlined"
                            size="small"
                          />
                        </Box>

                        <Typography variant="h5" color="primary.main" gutterBottom>
                          {formatPrice(auction.currentPrice, auction.currency)}
                        </Typography>

                        <Typography variant="body2" color="success.main" gutterBottom>
                          {getTimeRemaining(auction.endTime)}
                        </Typography>

                        <Button
                          variant="contained"
                          fullWidth
                          component={Link}
                          to={`/auction/${auction.id}`}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Box textAlign="center">
                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  to="/auctions"
                >
                  View All Auctions
                </Button>
              </Box>
            </>
          )}
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" gutterBottom>
          What Our Users Say
        </Typography>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>S</Avatar>
                <Box>
                  <Typography variant="h6">Sarah Johnson</Typography>
                  <Typography variant="body2" color="text.secondary">Seller</Typography>
                </Box>
                <Box sx={{ ml: 'auto' }}>
                  <Rating value={5} readOnly size="small" />
                </Box>
              </Box>
              <Typography>
                "AuctioneerX made it incredibly easy to sell my vintage collection.
                The real-time bidding kept buyers engaged, and I got amazing prices!"
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>M</Avatar>
                <Box>
                  <Typography variant="h6">Mike Chen</Typography>
                  <Typography variant="body2" color="text.secondary">Buyer</Typography>
                </Box>
                <Box sx={{ ml: 'auto' }}>
                  <Rating value={5} readOnly size="small" />
                </Box>
              </Box>
              <Typography>
                "I love the live bidding feature! It's so exciting to watch
                auctions unfold in real-time. Found some amazing deals here."
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'secondary.main',
          color: 'white',
          py: 6,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom>
            Ready to Start Your Auction Journey?
          </Typography>
          <Typography variant="h6" paragraph>
            Join thousands of satisfied users who trust AuctioneerX
            for their buying and selling needs
          </Typography>

          <Box sx={{ mt: 4 }}>
            {user ? (
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/auctions"
                sx={{
                  bgcolor: 'white',
                  color: 'secondary.main',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem'
                }}
              >
                Start Bidding Now
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  to="/register"
                  sx={{
                    bgcolor: 'white',
                    color: 'secondary.main',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    mr: 2
                  }}
                >
                  Sign Up Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  to="/login"
                  sx={{
                    color: 'white',
                    borderColor: 'white'
                  }}
                >
                  Sign In
                </Button>
              </>
            )}
          </Box>
        </Container>
      </Paper>
    </Box>
  );
};

export default Home;
