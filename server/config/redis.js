const { createClient } = require('redis');

console.log('🔍 Redis URL:', process.env.REDIS_URL ? 'Found' : 'Missing');

const redis = createClient({
  url: process.env.REDIS_URL
});

redis.on('error', (err) => console.log('❌ Redis Client Error:', err.message));
redis.on('connect', () => console.log('🔌 Redis connecting...'));
redis.on('ready', () => console.log('✅ Redis connected and ready'));
redis.on('end', () => console.log('⚠️ Redis connection closed'));
redis.on('reconnecting', () => console.log('🔄 Redis reconnecting...'));

(async () => {
  try {
    await redis.connect();
    const pong = await redis.ping();
    console.log('🏓 Redis PING result:', pong);
  } catch (error) {
    console.error('❌ Redis connection failed:', error.message);
    console.log('⚠️ App will continue without Redis caching');
  }
})();

module.exports = redis;
