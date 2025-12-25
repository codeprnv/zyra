import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_DATABASE_URI || '');

redis.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

redis.on('ready', () => {
  console.log('✅ Redis is ready');
});

redis.on('close', () => {
  console.warn('⚠️ Redis connection closed');
});

redis
  .ping()
  .then(() => {
    console.log('✅ Redis PING successful');
  })
  .catch((err) => {
    console.error('❌ Redis PING failed:', err.message);
  });
  

export default redis;
