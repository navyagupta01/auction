import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Avatar
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import {
  AccountCircle,
  Notifications,
  Add as AddIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { connected } = useSocket();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleClose();
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
  };

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          🔨 AuctionHub
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Show notifications badge if connected */}
          {connected && (
            <Badge color="success" variant="dot">
              <Notifications color="inherit" />
            </Badge>
          )}

          {/* Show these buttons only when user is logged in */}
          {user ? (
            <>
              <Button
                color="inherit"
                startIcon={<AddIcon />}
                component={Link}
                to="/create-auction"
                sx={{
                  textTransform: 'none',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                  }
                }}
              >
                Create Auction
              </Button>

              <Button
                color="inherit"
                startIcon={<DashboardIcon />}
                component={Link}
                to="/dashboard"
                sx={{ textTransform: 'none' }}
              >
                Dashboard
              </Button>

              <IconButton
                size="large"
                aria-label="account menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>

              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => handleNavigation('/profile')}>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => handleNavigation('/dashboard')}>
                  My Auctions
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                sx={{ textTransform: 'none' }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/register"
                variant="outlined"
                sx={{ textTransform: 'none' }}
              >
                Register
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
