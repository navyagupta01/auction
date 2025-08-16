import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Avatar,
  Box,
  Button,
  Grid,
  Stack,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert
} from '@mui/material';
import {
  Edit,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  Person,
  Save,
  Cancel
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [profileStats, setProfileStats] = useState({
    auctionsCreated: 0,
    totalSales: 0,
    memberSince: ''
  });

  useEffect(() => {
    if (user) {
      setEditedUser({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || ''
      });

      // Set member since date (using creation date or fallback)
      setProfileStats({
        auctionsCreated: user.auctionsCreated || 0,
        totalSales: user.totalSales || 0,
        memberSince: user.createdAt || new Date().toISOString()
      });
    }
  }, [user]);

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (editMode) {
      // Reset to original values if canceling
      setEditedUser({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || ''
      });
    }
  };

  const handleSave = async () => {
    // Here you would normally update the user profile via API
    console.log('Saving user profile:', editedUser);
    // For now, just close edit mode
    setEditMode(false);
    // In a real app: await userAPI.updateProfile(editedUser);
  };

  const handleInputChange = (field) => (event) => {
    setEditedUser({
      ...editedUser,
      [field]: event.target.value
    });
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">
          Please log in to view your profile.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Profile Header */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              margin: '0 auto',
              mb: 3,
              bgcolor: 'primary.main',
              fontSize: '3rem',
              boxShadow: 3
            }}
          >
            {(editedUser.name || user.email)?.charAt(0).toUpperCase()}
          </Avatar>

          {editMode ? (
            <TextField
              fullWidth
              label="Full Name"
              value={editedUser.name}
              onChange={handleInputChange('name')}
              sx={{ mb: 2, maxWidth: 300 }}
            />
          ) : (
            <Typography variant="h3" gutterBottom fontWeight="bold">
              {editedUser.name || 'No name set'}
            </Typography>
          )}

          <Chip
            label="Verified User"
            color="success"
            sx={{ mb: 2 }}
          />

          <Stack direction="row" spacing={2} justifyContent="center">
            {editMode ? (
              <>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                  color="success"
                >
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={handleEditToggle}
                  color="error"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={handleEditToggle}
                size="large"
              >
                Edit Profile
              </Button>
            )}
          </Stack>
        </Box>
      </Paper>

      {/* Personal Information */}
      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Person sx={{ mr: 1 }} />
          Personal Information
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {/* Email */}
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Email color="primary" />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Email Address
                </Typography>
                {editMode ? (
                  <TextField
                    fullWidth
                    value={editedUser.email}
                    onChange={handleInputChange('email')}
                    size="small"
                  />
                ) : (
                  <Typography variant="body1">
                    {editedUser.email || 'Not provided'}
                  </Typography>
                )}
              </Box>
            </Stack>
          </Grid>

          {/* Phone */}
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Phone color="primary" />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Phone Number
                </Typography>
                {editMode ? (
                  <TextField
                    fullWidth
                    value={editedUser.phone}
                    onChange={handleInputChange('phone')}
                    placeholder="Add phone number"
                    size="small"
                  />
                ) : (
                  <Typography variant="body1">
                    {editedUser.phone || 'Not provided'}
                  </Typography>
                )}
              </Box>
            </Stack>
          </Grid>

          {/* Address */}
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <LocationOn color="primary" />
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Address
                </Typography>
                {editMode ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={editedUser.address}
                    onChange={handleInputChange('address')}
                    placeholder="Add your address"
                    size="small"
                  />
                ) : (
                  <Typography variant="body1">
                    {editedUser.address || 'Not provided'}
                  </Typography>
                )}
              </Box>
            </Stack>
          </Grid>

          {/* Bio */}
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Person color="primary" />
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Bio
                </Typography>
                {editMode ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={editedUser.bio}
                    onChange={handleInputChange('bio')}
                    placeholder="Tell us about yourself"
                    size="small"
                  />
                ) : (
                  <Typography variant="body1">
                    {editedUser.bio || 'No bio added yet'}
                  </Typography>
                )}
              </Box>
            </Stack>
          </Grid>

          {/* Member Since */}
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} alignItems="center">
              <CalendarToday color="primary" />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Member Since
                </Typography>
                <Typography variant="body1">
                  {new Date(profileStats.memberSince).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Paper>



    </Container>
  );
};

export default Profile;
