import { readFileSync } from 'fs';
import { join } from 'path';
import { Algorithm } from 'jsonwebtoken';
import { JWT_CONFIG } from './constants.config';

/**
 * JWT Configuration with RSA256 Asymmetric Encryption
 *
 * Security Benefits:
 * - Uses RSA asymmetric encryption (more secure than symmetric HS256)
 * - Private key signs tokens (never leaves the server)
 * - Public key verifies tokens (can be shared safely)
 * - Prevents token forgery even if public key is compromised
 * - Industry standard for microservices and distributed systems
 *
 * Key Generation:
 * - Generate private key: openssl genrsa -out jwt-private.key 4096
 * - Extract public key: openssl rsa -in jwt-private.key -pubout -out jwt-public.key
 *
 * Environment Variables:
 * - JWT_PRIVATE_KEY: Base64-encoded private key or raw PEM string
 * - JWT_PUBLIC_KEY: Base64-encoded public key or raw PEM string
 * - Fallback: Load from files in keys/ directory if env vars not set
 *
 * Token Expiration (hardcoded in constants.config.ts):
 * - Access Token: 1 day
 * - Refresh Token: 7 days
 */

// Paths to RSA keys (relative to backend root)
const KEYS_DIR = join(__dirname, '../../keys');

// Read RSA keys from environment variables or files
let privateKey: string;
let publicKey: string;

try {
  // Try to read from environment variables first
  if (process.env.JWT_PRIVATE_KEY && process.env.JWT_PUBLIC_KEY) {
    // Decode from base64 if the key starts with base64:
    // Otherwise use the raw string (PEM format)
    privateKey = process.env.JWT_PRIVATE_KEY.startsWith('base64:')
      ? Buffer.from(
          process.env.JWT_PRIVATE_KEY.substring(7),
          'base64',
        ).toString('utf8')
      : process.env.JWT_PRIVATE_KEY.replace(/\\n/g, '\n');

    publicKey = process.env.JWT_PUBLIC_KEY.startsWith('base64:')
      ? Buffer.from(
          process.env.JWT_PUBLIC_KEY.substring(7),
          'base64',
        ).toString('utf8')
      : process.env.JWT_PUBLIC_KEY.replace(/\\n/g, '\n');

    console.log('✅ JWT RSA keys loaded from environment variables');
  } else {
    // Fallback to reading from files
    console.log('⚠️  JWT_PRIVATE_KEY and JWT_PUBLIC_KEY not found in .env');
    console.log('📁 Attempting to load RSA keys from files...');

    privateKey = readFileSync(
      process.env.JWT_PRIVATE_KEY_PATH || join(KEYS_DIR, 'jwt-private.key'),
      'utf8',
    );

    publicKey = readFileSync(
      process.env.JWT_PUBLIC_KEY_PATH || join(KEYS_DIR, 'jwt-public.key'),
      'utf8',
    );

    console.log('✅ JWT RSA keys loaded from files');
  }
} catch (error) {
  console.error('❌ Error loading RSA keys:', error);
  throw new Error(
    'RSA keys not found. Please either:\n' +
      '1. Set JWT_PRIVATE_KEY and JWT_PUBLIC_KEY in .env, OR\n' +
      '2. Generate key files using:\n' +
      '   openssl genrsa -out apps/backend/keys/jwt-private.key 4096\n' +
      '   openssl rsa -in apps/backend/keys/jwt-private.key -pubout -out apps/backend/keys/jwt-public.key',
  );
}

/**
 * JWT Access Token Configuration (RSA256)
 * Short-lived token for API authentication
 * Expiration time is hardcoded in constants.config.ts
 */
export const jwtAccessConfig = {
  privateKey,
  publicKey,
  signOptions: {
    algorithm: 'RS256' as Algorithm,
    expiresIn: JWT_CONFIG.ACCESS_EXPIRY,
    issuer: 'vinhxuan-cms',
    audience: 'vinhxuan-cms-users',
  },
  verifyOptions: {
    algorithms: ['RS256'] as Algorithm[],
    issuer: 'vinhxuan-cms',
    audience: 'vinhxuan-cms-users',
  },
};

/**
 * JWT Refresh Token Configuration (RSA256)
 * Long-lived token for obtaining new access tokens
 * Expiration time is hardcoded in constants.config.ts
 */
export const jwtRefreshConfig = {
  privateKey,
  publicKey,
  signOptions: {
    algorithm: 'RS256' as Algorithm,
    expiresIn: JWT_CONFIG.REFRESH_EXPIRY,
    issuer: 'vinhxuan-cms',
    audience: 'vinhxuan-cms-users',
  },
  verifyOptions: {
    algorithms: ['RS256'] as Algorithm[],
    issuer: 'vinhxuan-cms',
    audience: 'vinhxuan-cms-users',
  },
};

/**
 * Export keys for direct use if needed
 */
export const RSA_KEYS = {
  privateKey,
  publicKey,
};
