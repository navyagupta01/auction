import React from 'react';
import {
  Dialog, DialogContent, Typography, Button, Box,
  Slide, IconButton
} from '@mui/material';
import { EmojiEvents, Close, Email } from '@mui/icons-material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const WinnerDialog = ({ open, onClose, winner, auction, winningBid }) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="sm"
    fullWidth
    TransitionComponent={Transition}
  >
    <IconButton
      onClick={onClose}
      sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}
    >
      <Close />
    </IconButton>

    <DialogContent sx={{ textAlign: 'center', py: 6, px: 4 }}>
      <Box sx={{ mb: 3 }}>
        <EmojiEvents sx={{ fontSize: 100, color: 'gold', mb: 2 }} />
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          🎉 AUCTION WON! 🎉
        </Typography>
      </Box>

      <Box sx={{ bgcolor: 'primary.light', p: 3, borderRadius: 2, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>
          {auction?.title}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Winner: {winner?.name}
        </Typography>
      </Box>

      <Box sx={{ bgcolor: 'success.light', p: 2, borderRadius: 2, mb: 4 }}>
        <Typography variant="h4" color="success.dark" sx={{ fontWeight: 'bold' }}>
          Final Bid: ₹{winningBid?.toLocaleString()}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<Email />}
          onClick={() => {
            // Optional: Show contact details or open email
            console.log('Contact winner:', winner);
          }}
        >
          Contact Winner
        </Button>
        <Button
          variant="contained"
          onClick={onClose}
          size="large"
        >
          Continue
        </Button>
      </Box>
    </DialogContent>
  </Dialog>
);

export default WinnerDialog;
