import { Controller, Post, Body, Patch, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ResponseUtil } from '../common/utils/response.util';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user', description: 'Create a new user account with the provided information. The user will receive CUSTOMER role by default.' })
  @ApiBody({ type: RegisterDto, description: 'User registration information' })
  async register(@Body() registerDto: RegisterDto) {
    const authResponse = await this.authService.register(registerDto);
    return ResponseUtil.created(authResponse, 'User registered successfully');
  }

  @Post('login')
  @ApiOperation({ summary: 'Login', description: 'Authenticate user with email and password. Returns access token and refresh token.' })
  @ApiBody({ type: LoginDto, description: 'User login credentials' })
  async login(@Body() loginDto: LoginDto) {
    const authResponse = await this.authService.login(loginDto);
    return ResponseUtil.success(authResponse, 'Login successful');
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token', description: 'Get a new access token using a valid refresh token.' })
  @ApiBody({ type: RefreshTokenDto, description: 'Refresh token information' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const authResponse = await this.authService.refreshToken(refreshTokenDto.refreshToken);
    return ResponseUtil.success(authResponse, 'Token refreshed successfully');
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user password', description: 'Change the password for the currently authenticated user. Requires current password for verification.' })
  @ApiBody({ type: ChangePasswordDto, description: 'Current and new password' })
  async changePassword(@Req() req: any, @Body() changePasswordDto: ChangePasswordDto) {
    await this.authService.changePassword(req.user.userId, changePasswordDto);
    return ResponseUtil.success(null, 'Password changed successfully');
  }
}
