import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const redisConfig = {
  provide: 'REDIS_CLIENT',
  useFactory: (configService: ConfigService) => {
    const redisPassword = configService.get<string>('REDIS_PASSWORD');

    const redis = new Redis({
      host: configService.get<string>('REDIS_HOST', 'localhost'),
      port: configService.get<number>('REDIS_PORT', 6333),
      password: redisPassword || undefined,
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });

    redis.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    redis.on('error', (error) => {
      console.error('❌ Redis connection error:', error);
    });

    return redis;
  },
  inject: [ConfigService],
};
