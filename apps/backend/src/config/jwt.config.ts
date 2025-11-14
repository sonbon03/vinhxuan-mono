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
 * Environment Variables (Required):
 * - JWT_PRIVATE_KEY: Base64-encoded private key or raw PEM string
 * - JWT_PUBLIC_KEY: Base64-encoded public key or raw PEM string
 *
 * Token Expiration (hardcoded in constants.config.ts):
 * - Access Token: 1 day
 * - Refresh Token: 7 days
 */

// Read RSA keys from environment variables
let privateKey: string;
let publicKey: string;

/**
 * Validate that a key is a valid RSA key format
 */
// function validateRSAKey(key: string, keyType: 'private' | 'public'): void {
//   if (!key || typeof key !== 'string' || key.trim().length === 0) {
//     throw new Error(
//       `JWT ${keyType} key is empty or undefined. Please set JWT_${keyType.toUpperCase()}_KEY environment variable.`,
//     );
//   }

//   const trimmedKey = key.trim();

//   if (keyType === 'private') {
//     if (
//       !trimmedKey.includes('BEGIN PRIVATE KEY') &&
//       !trimmedKey.includes('BEGIN RSA PRIVATE KEY')
//     ) {
//       throw new Error(
//         `JWT private key is not a valid RSA private key. Expected PEM format.\n` +
//           `Key preview: ${trimmedKey.substring(0, 100)}...\n` +
//           `Please ensure JWT_PRIVATE_KEY is a valid RSA private key in PEM format.`,
//       );
//     }
//   } else {
//     if (!trimmedKey.includes('BEGIN PUBLIC KEY')) {
//       throw new Error(
//         `JWT public key is not a valid RSA public key. Expected PEM format.\n` +
//           `Key preview: ${trimmedKey.substring(0, 100)}...\n` +
//           `Please ensure JWT_PUBLIC_KEY is a valid RSA public key in PEM format.`,
//       );
//     }
//   }
// }

try {
  // Check if environment variables are set
  if (!process.env.JWT_PRIVATE_KEY || !process.env.JWT_PUBLIC_KEY) {
    throw new Error(
      'JWT_PRIVATE_KEY and JWT_PUBLIC_KEY must be provided in environment variables.\n' +
        'Please set both variables in your .env file or deployment environment.',
    );
  }

  // Decode from base64 if the key starts with base64:
  // Otherwise use the raw string (PEM format)
  // Also strip surrounding quotes if they exist
  let rawPrivateKey = process.env.JWT_PRIVATE_KEY;
  let rawPublicKey = process.env.JWT_PUBLIC_KEY;

  // Strip surrounding quotes if present (from .env file)
  if (rawPrivateKey.startsWith('"') && rawPrivateKey.endsWith('"')) {
    rawPrivateKey = rawPrivateKey.slice(1, -1);
  }
  if (rawPublicKey.startsWith('"') && rawPublicKey.endsWith('"')) {
    rawPublicKey = rawPublicKey.slice(1, -1);
  }

  privateKey = rawPrivateKey.startsWith('base64:')
    ? Buffer.from(rawPrivateKey.substring(7), 'base64').toString('utf8')
    : rawPrivateKey.replace(/\\n/g, '\n');

  publicKey = rawPublicKey.startsWith('base64:')
    ? Buffer.from(rawPublicKey.substring(7), 'base64').toString('utf8')
    : rawPublicKey.replace(/\\n/g, '\n');

  // Validate keys are valid RSA keys
  // validateRSAKey(privateKey, 'private');
  // validateRSAKey(publicKey, 'public');

  console.log('✅ JWT RSA keys loaded from environment variables');
  console.log(`   Private key length: ${privateKey.length} chars`);
  console.log(`   Public key length: ${publicKey.length} chars`);
} catch (error) {
  console.error('❌ Error loading RSA keys:', error);
  if (error instanceof Error && error.message.includes('JWT')) {
    throw error; // Re-throw validation errors as-is
  }
  throw new Error(
    'Failed to load JWT RSA keys from environment variables.\n' +
      'Please ensure JWT_PRIVATE_KEY and JWT_PUBLIC_KEY are set correctly.\n\n' +
      `Error details: ${error instanceof Error ? error.message : String(error)}`,
  );
}

// Final validation before export
if (!privateKey || !publicKey) {
  throw new Error(
    'JWT keys are not properly initialized. Please check your environment variables.',
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
