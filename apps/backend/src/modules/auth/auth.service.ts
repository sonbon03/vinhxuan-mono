import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JwtPayload, AuthResponse } from 'src/common/types';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { jwtAccessConfig, jwtRefreshConfig } from '../../config/jwt.config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    try {
      this.logger.log(`Login attempt for ${loginDto.email}`);
      const user = await this.validateUser(loginDto.email, loginDto.password);
      if (!user) {
        this.logger.warn(`Invalid credentials for ${loginDto.email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload: JwtPayload = {
        sub: user.id,
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = this.jwtService.sign(payload, {
        privateKey: jwtAccessConfig.privateKey,
        algorithm: jwtAccessConfig.signOptions.algorithm,
        expiresIn: jwtAccessConfig.signOptions.expiresIn,
        issuer: jwtAccessConfig.signOptions.issuer,
        audience: jwtAccessConfig.signOptions.audience,
      });
      const refreshToken = this.jwtService.sign(payload, {
        privateKey: jwtRefreshConfig.privateKey,
        algorithm: jwtRefreshConfig.signOptions.algorithm,
        expiresIn: jwtRefreshConfig.signOptions.expiresIn,
        issuer: jwtRefreshConfig.signOptions.issuer,
        audience: jwtRefreshConfig.signOptions.audience,
      });

      const response = {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      };

      this.logger.log(`Login success for ${loginDto.email}`);
      return response;
    } catch (error) {
      this.logger.error(
        `Login failed for ${loginDto.email}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const user = await this.usersService.create(registerDto);

    const payload: JwtPayload = {
      sub: user.id,
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      privateKey: jwtAccessConfig.privateKey,
      algorithm: jwtAccessConfig.signOptions.algorithm,
      expiresIn: jwtAccessConfig.signOptions.expiresIn,
      issuer: jwtAccessConfig.signOptions.issuer,
      audience: jwtAccessConfig.signOptions.audience,
    });
    const refreshToken = this.jwtService.sign(payload, {
      privateKey: jwtRefreshConfig.privateKey,
      algorithm: jwtRefreshConfig.signOptions.algorithm,
      expiresIn: jwtRefreshConfig.signOptions.expiresIn,
      issuer: jwtRefreshConfig.signOptions.issuer,
      audience: jwtRefreshConfig.signOptions.audience,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        publicKey: jwtRefreshConfig.publicKey,
        algorithms: jwtRefreshConfig.verifyOptions.algorithms,
        issuer: jwtRefreshConfig.verifyOptions.issuer,
        audience: jwtRefreshConfig.verifyOptions.audience,
      });

      const user = await this.usersService.findOne(payload.sub);

      const newPayload: JwtPayload = {
        sub: user.id,
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const newAccessToken = this.jwtService.sign(newPayload, {
        privateKey: jwtAccessConfig.privateKey,
        algorithm: jwtAccessConfig.signOptions.algorithm,
        expiresIn: jwtAccessConfig.signOptions.expiresIn,
        issuer: jwtAccessConfig.signOptions.issuer,
        audience: jwtAccessConfig.signOptions.audience,
      });
      const newRefreshToken = this.jwtService.sign(newPayload, {
        privateKey: jwtRefreshConfig.privateKey,
        algorithm: jwtRefreshConfig.signOptions.algorithm,
        expiresIn: jwtRefreshConfig.signOptions.expiresIn,
        issuer: jwtRefreshConfig.signOptions.issuer,
        audience: jwtRefreshConfig.signOptions.audience,
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async changePassword(
    userId: string,
    changePasswordDto: { currentPassword: string; newPassword: string },
  ): Promise<void> {
    const user = await this.usersService.findOne(userId);

    // Verify current password
    const isPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Update password (password will be hashed in usersService.update)
    await this.usersService.update(userId, { password: changePasswordDto.newPassword } as any);
  }
}
