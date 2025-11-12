import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { jwtAccessConfig } from '../../config/jwt.config';

/**
 * Authentication Module with RSA256 Security
 *
 * Security Implementation:
 * - Uses RSA256 asymmetric encryption for JWT tokens
 * - Private key signs tokens (kept secure on server)
 * - Public key verifies tokens (can be shared safely)
 * - More secure than symmetric HS256 algorithm
 * - Industry standard for distributed systems
 *
 * Benefits:
 * - Prevents token forgery
 * - Better key management
 * - Supports token verification by multiple services
 * - Enhanced security for sensitive operations
 */
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      privateKey: jwtAccessConfig.privateKey,
      publicKey: jwtAccessConfig.publicKey,
      signOptions: jwtAccessConfig.signOptions,
      verifyOptions: jwtAccessConfig.verifyOptions,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
