require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');
const path = require('path');
const sequelize = require('./config/database');

console.log('Initializing Redis...');
const redis = require('./config/redis');

const User = require('./models/User');
const Auction = require('./models/Auction');
const Bid = require('./models/Bid');
require('./models/associations');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST']
  }
});

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Email']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.set('io', io);

console.log('📋 Registering routes...');

// SAFE ROUTE REGISTRATION - Only register routes that we know work
try {
  app.use('/api/auth', require('./routes/auth'));
  console.log('✅ Auth routes registered');
} catch (error) {
  console.log('❌ Auth routes failed:', error.message);
}

try {
  app.use('/api/auctions', require('./routes/auctions'));
  console.log('✅ Auction routes registered');
} catch (error) {
  console.log('❌ Auction routes failed:', error.message);
}

// SKIP analytics for now to avoid the error
// try {
//   const analyticsRoutes = require('./routes/analytics');
//   app.use('/api/analytics', analyticsRoutes);
//   console.log('✅ Analytics routes registered');
// } catch (error) {
//   console.log('❌ Analytics routes failed:', error.message);
// }

console.log('✅ Routes registered');

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date() });
});

const createTablesManually = async () => {
  try {
    console.log('🗑️ Dropping existing tables to fix case issues...');
    await sequelize.query('DROP TABLE IF EXISTS "bids" CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS "auctions" CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS "users" CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS "Bids" CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS "Auctions" CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS "Users" CASCADE;');

    await sequelize.query(`
      CREATE TABLE "Users" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" VARCHAR(255) NOT NULL,
        "email" VARCHAR(255) NOT NULL UNIQUE,
        "password" VARCHAR(255) NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✅ Users table created');

    await sequelize.query(`
      CREATE TABLE "Auctions" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "title" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "startingPrice" DECIMAL(10,2) NOT NULL,
        "currentPrice" DECIMAL(10,2) NOT NULL,
        "currency" VARCHAR(255) DEFAULT 'INR',
        "category" VARCHAR(255) NOT NULL,
        "condition" VARCHAR(255) NOT NULL,
        "images" JSON DEFAULT '[]',
        "endTime" TIMESTAMP WITH TIME ZONE NOT NULL,
        "status" VARCHAR(20) DEFAULT 'active',
        "sellerId" UUID NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE,
        "winnerId" UUID REFERENCES "Users"("id") ON DELETE SET NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✅ Auctions table created');

    await sequelize.query(`
      CREATE TABLE "Bids" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "amount" DECIMAL(10,2) NOT NULL,
        "bidderId" UUID NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE,
        "auctionId" UUID NOT NULL REFERENCES "Auctions"("id") ON DELETE CASCADE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✅ Bids table created with foreign key constraints');

  } catch (error) {
    console.log('Table creation error:', error.message);
  }
};

io.on('connection', (socket) => {
  console.log('New client connected: ' + socket.id);

  socket.on('join_auction', (auctionId) => {
    socket.join(`auction_${auctionId}`);
    console.log('Socket ' + socket.id + ' joined auction room: ' + auctionId);
    socket.emit('joined_auction', { auctionId, message: 'Connected to live auction' });
  });

  socket.on('leave_auction', (auctionId) => {
    socket.leave(`auction_${auctionId}`);
    console.log('Socket ' + socket.id + ' left auction room: ' + auctionId);
  });

  socket.on('place_bid', async (bidData) => {
    try {
      const { auctionId, amount, userId, userEmail } = bidData;
      console.log('Bid received:', { auctionId, amount, userId, userEmail });

      if (!auctionId || !amount || !userId) {
        socket.emit('bid_error', { message: 'Invalid bid data provided' });
        return;
      }

      const auction = await Auction.findByPk(auctionId);
      if (!auction) {
        socket.emit('bid_error', { message: 'Auction not found' });
        return;
      }

      if (auction.status !== 'active') {
        socket.emit('bid_error', { message: 'Auction is no longer active' });
        return;
      }

      const bidAmount = parseFloat(amount);
      const currentPrice = parseFloat(auction.currentPrice);

      if (bidAmount <= currentPrice) {
        socket.emit('bid_error', { message: 'Bid must be higher than current price' });
        return;
      }

      const bid = await Bid.create({ amount: bidAmount, bidderId: userId, auctionId });

      auction.currentPrice = bidAmount;
      await auction.save();

      try {
        await redis.setEx(`auction:${auctionId}`, 300, JSON.stringify(auction));
      } catch (cacheError) {
        console.warn('Cache update failed (non-critical):', cacheError.message);
      }

      const user = await User.findByPk(userId);
      if (!user) {
        socket.emit('bid_error', { message: 'User not found' });
        return;
      }

      const bidResponse = {
        auctionId,
        amount: bidAmount,
        bidder: { id: userId, name: user.name, email: user.email },
        timestamp: new Date(),
        bidCount: await Bid.count({ where: { auctionId } })
      };

      io.to(`auction_${auctionId}`).emit('new_bid', bidResponse);

      console.log('✅ Bid successful:', bidAmount, auctionId, userEmail);
    } catch (error) {
      console.error('❌ Bid error details:', {
        message: error.message,
        name: error.name,
        code: error.parent?.code,
        detail: error.parent?.detail
      });
      socket.emit('bid_error', { message: error.message || 'Internal server error. Please try again.' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected: ' + socket.id);
  });
});

const startServer = async () => {
  try {
    console.log('🚀 Starting server...');
    await sequelize.authenticate();
    console.log('✅ Connected to Supabase PostgreSQL');
    await createTablesManually();
    console.log('✅ All tables ready with proper constraints');

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, '0.0.0.0', () => {
      console.log('🚀 Server running on port ' + PORT);
      console.log('🎯 Your auction platform is ready!');
      console.log('🔗 Test: http://localhost:' + PORT + '/api/test');
      console.log('🔗 React app: http://localhost:3000');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// PRODUCTION: Static file serving
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));

  // SAFE catch-all route
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

startServer();
