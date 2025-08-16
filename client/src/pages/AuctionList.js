import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Box
} from '@mui/material';
import { Gavel, Add } from '@mui/icons-material';
import { auctionAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import AuctionCard from '../components/AuctionCard'; // Import the new component

const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      const response = await auctionAPI.getAll();
      setAuctions(response.data);
    } catch (error) {
      console.error('Failed to fetch auctions:', error);
      setError('Failed to load auctions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading auctions...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button onClick={fetchAuctions} variant="contained">
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h3" gutterBottom fontWeight="bold">
          Live Auctions
        </Typography>
        <Typography variant="h6" paragraph>
          Discover amazing items and place your winning bids
        </Typography>

        {user && (
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/create-auction"
            startIcon={<Add />}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': { bgcolor: 'grey.100' }
            }}
          >
            Create New Auction
          </Button>
        )}
      </Paper>

      {/* Auctions Grid */}
      {auctions.length === 0 ? (
        <Paper elevation={2} sx={{ p: 6, textAlign: 'center' }}>
          <Gavel sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            No auctions available
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Be the first to create an exciting auction!
          </Typography>
          {user && (
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/create-auction"
              startIcon={<Gavel />}
            >
              Create First Auction
            </Button>
          )}
        </Paper>
      ) : (
        <>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            {auctions.length} Auction{auctions.length !== 1 ? 's' : ''} Available
          </Typography>

          <Grid container spacing={3}>
            {auctions.map((auction) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={auction.id}>
                <AuctionCard auction={auction} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default AuctionList;
