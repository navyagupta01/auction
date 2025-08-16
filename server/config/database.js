// Add explicit dotenv config at the top
require('dotenv').config();

const { Sequelize } = require('sequelize');

// Debug: Check if SUPABASE_URL is loaded
console.log('🔍 SUPABASE_URL loaded:', process.env.SUPABASE_URL ? 'YES' : 'NO');
console.log('🔍 Full URL:', process.env.SUPABASE_URL);

// Exit if SUPABASE_URL is missing
if (!process.env.SUPABASE_URL) {
  console.error('❌ SUPABASE_URL is missing from .env file');
  process.exit(1);
}

const sequelize = new Sequelize(process.env.SUPABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false
});

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to Supabase PostgreSQL');
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
  }
};

testConnection();

module.exports = sequelize;
