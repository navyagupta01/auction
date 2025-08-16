

const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log('🔍 DATABASE_URL loaded:', !!process.env.DATABASE_URL);
console.log('🔍 Full URL:', process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is missing from environment variables');
  process.exit(1);
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: console.log
});

module.exports = sequelize;
