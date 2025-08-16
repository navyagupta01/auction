import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    let socketInstance = null;

    if (user) {
      console.log('🔌 Initializing socket connection for user:', user.email);

      // Create socket connection
      socketInstance = io('http://localhost:5000', {
        transports: ['websocket', 'polling'], // Allow both transports
        timeout: 10000,
        forceNew: true
      });

      // Connection event handlers
      socketInstance.on('connect', () => {
        console.log('✅ Socket connected:', socketInstance.id);
        setConnected(true);
      });

      socketInstance.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error);
        setConnected(false);
      });

      socketInstance.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected:', reason);
        setConnected(false);
      });

      socketInstance.on('reconnect', (attemptNumber) => {
        console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
        setConnected(true);
      });

      setSocket(socketInstance);
    }

    return () => {
      if (socketInstance) {
        console.log('🔌 Cleaning up socket connection');
        socketInstance.disconnect();
        setSocket(null);
        setConnected(false);
      }
    };
  }, [user]);

  const joinAuction = (auctionId) => {
    if (socket && connected) {
      console.log('🏠 Joining auction room:', auctionId);
      socket.emit('join_auction', auctionId);
    }
  };

  const leaveAuction = (auctionId) => {
    if (socket && connected) {
      console.log('🚪 Leaving auction room:', auctionId);
      socket.emit('leave_auction', auctionId);
    }
  };

  const value = {
    socket,
    connected,
    joinAuction,
    leaveAuction
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
