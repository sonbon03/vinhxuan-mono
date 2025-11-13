import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from 'src/common/types';
import { jwtAccessConfig } from '../../../config/jwt.config';

/**
 * JWT Strategy with RSA256 Verification
 *
 * Security Implementation:
 * - Uses RSA256 asymmetric encryption for token verification
 * - Public key verifies tokens signed with private key
 * - Validates token signature, expiry, issuer, and audience
 * - Prevents token tampering and forgery
 *
 * Token Verification Process:
 * 1. Extract token from Authorization header (Bearer token)
 * 2. Verify signature using RSA public key
 * 3. Validate issuer and audience claims
 * 4. Check token expiration
 * 5. Return validated payload to request context
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtAccessConfig.publicKey,
      algorithms: jwtAccessConfig.verifyOptions.algorithms,
      issuer: jwtAccessConfig.verifyOptions.issuer,
      audience: jwtAccessConfig.verifyOptions.audience,
    });
  }

  /**
   * Validates JWT payload and attaches user info to request
   * This method is called automatically after successful token verification
   */
  async validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
