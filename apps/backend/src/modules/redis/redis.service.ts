import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  /**
   * Get a value from Redis
   */
  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  /**
   * Set a value in Redis
   */
  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.redisClient.setex(key, ttlSeconds, value);
    } else {
      await this.redisClient.set(key, value);
    }
  }

  /**
   * Delete a key from Redis
   */
  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  /**
   * Check if a key exists
   */
  async exists(key: string): Promise<boolean> {
    const result = await this.redisClient.exists(key);
    return result === 1;
  }

  /**
   * Set expiration time for a key
   */
  async expire(key: string, seconds: number): Promise<void> {
    await this.redisClient.expire(key, seconds);
  }

  /**
   * Get time to live for a key
   */
  async ttl(key: string): Promise<number> {
    return this.redisClient.ttl(key);
  }

  /**
   * Blacklist a token (for logout functionality)
   */
  async blacklistToken(token: string, expirySeconds: number): Promise<void> {
    const key = `blacklist:${token}`;
    await this.set(key, '1', expirySeconds);
  }

  /**
   * Check if a token is blacklisted
   */
  async isTokenBlacklisted(token: string): Promise<boolean> {
    const key = `blacklist:${token}`;
    return this.exists(key);
  }

  /**
   * Store user session
   */
  async setSession(userId: string, sessionData: any, ttlSeconds: number = 86400): Promise<void> {
    const key = `session:${userId}`;
    await this.set(key, JSON.stringify(sessionData), ttlSeconds);
  }

  /**
   * Get user session
   */
  async getSession(userId: string): Promise<any | null> {
    const key = `session:${userId}`;
    const data = await this.get(key);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Delete user session
   */
  async deleteSession(userId: string): Promise<void> {
    const key = `session:${userId}`;
    await this.del(key);
  }

  /**
   * Cache data with optional TTL
   */
  async cache(key: string, data: any, ttlSeconds: number = 3600): Promise<void> {
    await this.set(key, JSON.stringify(data), ttlSeconds);
  }

  /**
   * Get cached data
   */
  async getCached<T>(key: string): Promise<T | null> {
    const data = await this.get(key);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Invalidate cache
   */
  async invalidateCache(key: string): Promise<void> {
    await this.del(key);
  }

  /**
   * Invalidate cache by pattern
   */
  async invalidateCacheByPattern(pattern: string): Promise<void> {
    const keys = await this.redisClient.keys(pattern);
    if (keys.length > 0) {
      await this.redisClient.del(...keys);
    }
  }

  /**
   * Increment a counter
   */
  async increment(key: string): Promise<number> {
    return this.redisClient.incr(key);
  }

  /**
   * Decrement a counter
   */
  async decrement(key: string): Promise<number> {
    return this.redisClient.decr(key);
  }

  /**
   * Rate limiting check
   */
  async checkRateLimit(identifier: string, maxRequests: number, windowSeconds: number): Promise<boolean> {
    const key = `ratelimit:${identifier}`;
    const current = await this.increment(key);

    if (current === 1) {
      await this.expire(key, windowSeconds);
    }

    return current <= maxRequests;
  }

  /**
   * Get the underlying Redis client (use with caution)
   */
  getClient(): Redis {
    return this.redisClient;
  }
}
