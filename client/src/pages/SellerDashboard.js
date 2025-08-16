import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, Table, TableBody, TableCell,
  TableHead, TableRow, Chip
} from '@mui/material';
import { auctionAPI } from '../services/api';
import { useSocket } from '../contexts/SocketContext';

const SellerDashboard = () => {
  const [auctions, setAuctions] = useState([]);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const { socket } = useSocket();

  useEffect(() => {
    fetchMyAuctions();
  }, []);

  const fetchMyAuctions = async () => {
    try {
      const response = await auctionAPI.getUserAuctions();
      setAuctions(response.data);
    } catch (error) {
      console.error('Failed to fetch auctions:', error);
    }
  };

  const handleEndAuction = (auction) => {
    setSelectedAuction(auction);
    setConfirmDialog(true);
  };

  const confirmEndAuction = () => {
    if (socket && selectedAuction) {
      socket.emit('end_auction', {
        auctionId: selectedAuction.id,
        sellerId: selectedAuction.sellerId
      });
    }
    setConfirmDialog(false);
    setSelectedAuction(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Seller Dashboard
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Current Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Bids</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {auctions.map((auction) => (
              <TableRow key={auction.id}>
                <TableCell>{auction.title}</TableCell>
                <TableCell>₹{auction.currentPrice}</TableCell>
                <TableCell>
                  <Chip
                    label={auction.status}
                    color={auction.status === 'active' ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell>{auction.bids?.length || 0}</TableCell>
                <TableCell>
                  {auction.status === 'active' && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleEndAuction(auction)}
                    >
                      End Auction
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>End Auction</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to end this auction? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
          <Button onClick={confirmEndAuction} color="secondary">
            End Auction
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SellerDashboard;
