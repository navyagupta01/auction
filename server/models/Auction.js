const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Auction = sequelize.define('Auction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  startingPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currentPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'INR'
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  condition: {
    type: DataTypes.STRING,
    allowNull: false
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active'
  },
  sellerId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  winnerId: {
    type: DataTypes.UUID,
    allowNull: true
  }
}, {
  tableName: 'Auctions',      // **FIX: Explicit table name**
  freezeTableName: true       // **FIX: Prevent pluralization**
});

module.exports = Auction;
