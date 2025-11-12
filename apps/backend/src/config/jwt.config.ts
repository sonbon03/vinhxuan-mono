import { readFileSync } from 'fs';
import { join } from 'path';
import { Algorithm } from 'jsonwebtoken';

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
 */

// Paths to RSA keys (relative to backend root)
const KEYS_DIR = join(__dirname, '../../keys');

// Read RSA keys from files
let privateKey: string;
let publicKey: string;

try {
  // Private key for signing tokens
  privateKey = readFileSync(
    process.env.JWT_PRIVATE_KEY_PATH || join(KEYS_DIR, 'jwt-private.key'),
    'utf8',
  );

  // Public key for verifying tokens
  publicKey = readFileSync(
    process.env.JWT_PUBLIC_KEY_PATH || join(KEYS_DIR, 'jwt-public.key'),
    'utf8',
  );
} catch (error) {
  console.error('Error loading RSA keys:', error);
  throw new Error(
    'RSA keys not found. Please generate keys using: ' +
      'openssl genrsa -out keys/jwt-private.key 4096 && ' +
      'openssl rsa -in keys/jwt-private.key -pubout -out keys/jwt-public.key',
  );
}

/**
 * JWT Access Token Configuration (RSA256)
 * Short-lived token for API authentication
 */
export const jwtAccessConfig = {
  privateKey,
  publicKey,
  signOptions: {
    algorithm: 'RS256' as Algorithm,
    expiresIn: process.env.JWT_ACCESS_EXPIRY || '1d',
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
 */
export const jwtRefreshConfig = {
  privateKey,
  publicKey,
  signOptions: {
    algorithm: 'RS256' as Algorithm,
    expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
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
