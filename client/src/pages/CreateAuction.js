import React, { useState } from 'react';
import { Container, Paper, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auctionAPI } from '../services/api';  // ← Fixed import
import { useAuth } from '../contexts/AuthContext';

const CreateAuction = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  const [form, setForm] = useState({
    title: '',
    description: '',
    startingPrice: '',
    currency: 'INR',
    duration: '24',
    category: 'art-collectibles',
    condition: 'new'
  });

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const onImages = e => setImages(Array.from(e.target.files));

  const submit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    images.forEach(img => fd.append('images', img));

    try {
      const { data } = await auctionAPI.create(fd);
      navigate(`/auction/${data.id}`);
    } catch (err) {
      console.error('Create auction error:', err);
      setError(err.response?.data?.message || 'Failed to create auction');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Alert severity="warning">Please login to create an auction</Alert>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>New Auction</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={submit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Title"
                name="title"
                value={form.title}
                onChange={onChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={3}
                label="Description"
                name="description"
                value={form.description}
                onChange={onChange}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                required
                type="number"
                label="Starting Price"
                name="startingPrice"
                value={form.startingPrice}
                onChange={onChange}
              />
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select name="currency" value={form.currency} onChange={onChange} label="Currency">
                  <MenuItem value="INR">INR</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Duration (hrs)</InputLabel>
                <Select name="duration" value={form.duration} onChange={onChange} label="Duration">
                  {[1, 6, 12, 24, 48, 72, 168].map(h =>
                    <MenuItem key={h} value={h}>{h}</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select name="category" value={form.category} onChange={onChange} label="Category">
                  <MenuItem value="art-collectibles">Art & Collectibles</MenuItem>
                  <MenuItem value="electronics">Electronics</MenuItem>
                  <MenuItem value="furniture">Furniture</MenuItem>
                  <MenuItem value="jewelry">Jewelry</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Condition</InputLabel>
                <Select name="condition" value={form.condition} onChange={onChange} label="Condition">
                  {['new', 'like-new', 'good', 'fair', 'poor'].map(c =>
                    <MenuItem key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' ')}
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/* IMAGE UPLOAD */}
            <Grid item xs={12}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={onImages}
                style={{ marginBottom: '10px' }}
              />
              <Typography variant="body2" color="text.secondary">
                Selected: {images.length} images
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                type="submit"
                fullWidth
                disabled={loading}
                size="large"
              >
                {loading ? 'Creating Auction...' : 'Create Auction'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateAuction;
