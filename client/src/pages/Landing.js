import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Paper
} from '@mui/material';
import {
  Gavel,
  Security,
  Speed,
  TrendingUp,
  SwipeLeft,
  SwipeRight
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Landing = () => {
  const features = [
    {
      icon: <Gavel sx={{ fontSize: 40 }} />,
      title: 'Live Bidding',
      description: 'Real-time auction experience with instant notifications'
    },
    {
      icon: <SwipeRight sx={{ fontSize: 40 }} />,
      title: 'Swipe to Bid',
      description: 'Tinder-style interface - swipe right to join, left to skip'
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Secure Transactions',
      description: 'Protected payments and verified sellers'
    },
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: 'Quick Actions',
      description: 'Create auctions in seconds, bid with one tap'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 10,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            🔨 AuctionHub
          </Typography>
          <Typography variant="h5" paragraph sx={{ opacity: 0.9 }}>
            Discover amazing auctions with a swipe. Bid smart, win big!
          </Typography>
          <Box sx={{ mt: 4, gap: 2, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/register"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                '&:hover': { bgcolor: 'grey.100' }
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/login"
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 1.5
              }}
            >
              Login
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Why Choose AuctionHub?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h3" align="center" gutterBottom>
            How It Works
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} md={4} textAlign="center">
              <Typography variant="h4" color="primary.main">1</Typography>
              <Typography variant="h6">Browse Auctions</Typography>
              <Typography variant="body2" color="text.secondary">
                Swipe through live auctions like Tinder cards
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} textAlign="center">
              <Typography variant="h4" color="primary.main">2</Typography>
              <Typography variant="h6">Swipe to Bid</Typography>
              <Typography variant="body2" color="text.secondary">
                Swipe right to join auction, left to skip
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} textAlign="center">
              <Typography variant="h4" color="primary.main">3</Typography>
              <Typography variant="h6">Win & Pay</Typography>
              <Typography variant="body2" color="text.secondary">
                Get notified if you win and complete secure payment
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
