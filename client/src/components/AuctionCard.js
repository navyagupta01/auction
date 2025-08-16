import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Box,
  Button
} from '@mui/material';
import {
  Gavel,
  AccessTime,
  TrendingUp
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const AuctionCard = ({ auction }) => {
  const [imgError, setImgError] = useState(false);

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

  // Fix: Always point to backend server (port 5000) for images
  const hasValidImage = auction.images && auction.images.length > 0 && !imgError;
  const imageUrl = hasValidImage
    ? `http://localhost:5000/uploads/${auction.images[0]}`  // Force backend URL
    : null;

  console.log('🖼️ Image URL:', imageUrl);
  console.log('🖼️ Auction images:', auction.images);

  return (
    <Card
      elevation={3}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: 6
        }
      }}
    >
      {/* Image Section */}
      {imageUrl ? (
        <CardMedia
          component="img"
          height="220"
          image={imageUrl}
          alt={auction.title}
          sx={{
            objectFit: 'cover',
            borderRadius: '4px 4px 0 0'
          }}
          onError={() => {
            console.error(`❌ Image failed to load: ${imageUrl}`);
            setImgError(true);
          }}
          onLoad={() => console.log(`✅ Image loaded successfully: ${imageUrl}`)}
        />
      ) : (
        <Box
          sx={{
            height: 220,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.100',
            borderRadius: '4px 4px 0 0'
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Gavel sx={{ fontSize: 60, color: 'grey.400', mb: 1 }} />
            <Typography variant="body2" color="grey.500">
              No Image Available
            </Typography>
          </Box>
        </Box>
      )}

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Title */}
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          noWrap
          sx={{ fontWeight: 'bold' }}
        >
          {auction.title}
        </Typography>

        {/* Description Preview */}
        <Typography
          variant="body2"
          color="text.secondary"
          paragraph
          sx={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            overflow: 'hidden',
            flexGrow: 1,
            mb: 2
          }}
        >
          {auction.description || 'No description available'}
        </Typography>

        {/* Status and Category Chips */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            label={auction.status}
            color={auction.status === 'active' ? 'success' : 'default'}
            size="small"
            icon={auction.status === 'active' ? <TrendingUp /> : undefined}
          />
          <Chip
            label={auction.category}
            variant="outlined"
            size="small"
          />
          {auction.condition && (
            <Chip
              label={auction.condition}
              variant="outlined"
              size="small"
              color="secondary"
            />
          )}
        </Box>

        {/* Current Price */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <TrendingUp sx={{ mr: 1, fontSize: 20, color: 'primary.main' }} />
          <Typography variant="h6" color="primary.main" fontWeight="bold">
            {formatPrice(auction.currentPrice, auction.currency)}
          </Typography>
        </Box>

        {/* Time Remaining */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AccessTime sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />
          <Typography
            variant="body2"
            color={auction.status === 'ended' ? 'error' : 'success.main'}
            fontWeight="medium"
          >
            {getTimeRemaining(auction.endTime)}
          </Typography>
        </Box>

        {/* Action Button */}
        <Button
          variant="contained"
          fullWidth
          component={Link}
          to={`/auction/${auction.id}`}
          disabled={auction.status === 'ended'}
          sx={{ mt: 'auto' }}
        >
          {auction.status === 'active' ? 'Place Bid' : 'View Details'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AuctionCard;
