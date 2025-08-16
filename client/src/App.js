import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';

// Import components
import Navbar from './components/Navbar';
import Home from './pages/Home';           // Landing page
import Dashboard from './pages/Dashboard'; // NEW: User dashboard
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';     // User profile with detailed stats
import AuctionList from './pages/AuctionList';
import CreateAuction from './pages/CreateAuction';
import AuctionDetail from './pages/AuctionDetail';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <SocketProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/auctions" element={<AuctionList />} />
              <Route path="/create-auction" element={<CreateAuction />} />
              <Route path="/auction/:id" element={<AuctionDetail />} />
            </Routes>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
