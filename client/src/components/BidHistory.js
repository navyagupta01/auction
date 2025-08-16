import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  Divider,
  Chip
} from '@mui/material';
import { Gavel, Person, EmojiEvents } from '@mui/icons-material';
import { formatPrice, formatDate } from '../utils/helpers';
import moment from 'moment';

const BidHistory = ({ bids, currentUserId }) => {
  const sortedBids = [...bids].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (!bids || bids.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Gavel sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No bids yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Be the first to place a bid!
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ width: '100%' }}>
      {sortedBids.map((bid, index) => {
        const isWinning = index === 0;
        const isCurrentUser = bid.bidder?._id === currentUserId;
        const timeAgo = moment(bid.createdAt).fromNow();

        return (
          <React.Fragment key={bid._id || index}>
            <ListItem
              className={`bid-history-item ${isWinning ? 'winning-bid' : ''}`}
              sx={{
                bgcolor: isWinning ? 'success.light' : isCurrentUser ? 'primary.light' : 'transparent',
                borderRadius: 1,
                mb: 1,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  bgcolor: isWinning ? 'success.light' : isCurrentUser ? 'primary.light' : 'action.hover'
                }
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: isWinning ? 'success.main' : isCurrentUser ? 'primary.main' : 'grey.500'
                  }}
                >
                  {isWinning ? <EmojiEvents /> : <Person />}
                </Avatar>
              </ListItemAvatar>

              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
                      {formatPrice(bid.amount)}
                    </Typography>
                    {isWinning && (
                      <Chip
                        label="Leading Bid"
                        color="success"
                        size="small"
                        icon={<EmojiEvents />}
                      />
                    )}
                    {isCurrentUser && (
                      <Chip
                        label="Your Bid"
                        color="primary"
                        size="small"
                      />
                    )}
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      By: {bid.bidder?.name || bid.bidder?.email || 'Anonymous'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {timeAgo} • {formatDate(bid.createdAt)}
                    </Typography>
                    {bid.type === 'counter_offer' && (
                      <Chip
                        label="Counter Offer"
                        color="warning"
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                }
              />
            </ListItem>

            {index < sortedBids.length - 1 && <Divider component="li" />}
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default BidHistory;
