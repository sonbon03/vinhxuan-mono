import { Module, Global } from '@nestjs/common';
import { redisConfig } from '../../config/redis.config';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [redisConfig, RedisService],
  exports: [redisConfig, RedisService],
})
export class RedisModule {}
