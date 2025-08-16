const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log('🔍 DATABASE_URL loaded:', !!process.env.DATABASE_URL);

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
  host: 'db.peeynrzpgyeykzxgsich.supabase.co', // Force specific hostname
  port: 5432,
  database: 'postgres',
  username: 'postgres',
  password: 'navyagupta123',
  logging: console.log
});

module.exports = sequelize;
