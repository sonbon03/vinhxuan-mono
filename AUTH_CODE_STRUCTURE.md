# Backend Authentication Module - Code Structure Reference

## File Locations and Key Code Snippets

### 1. DTOs (Data Transfer Objects)

**Location**: `packages/shared/src/types/auth.types.ts`

```typescript
// Login - 2 fields
export interface LoginDto {
  email: string;
  password: string;
}

// Register - 5 fields
export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth: Date;
}

// Refresh Token - 1 field
export interface RefreshTokenDto {
  refreshToken: string;
}

// Response - Contains tokens and user info
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: UserRole;
  };
}

// Payload stored inside JWT
export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
```

**Location**: `apps/backend/src/modules/auth/dto/change-password.dto.ts`

```typescript
export class ChangePasswordDto {
  @ApiProperty({ description: 'Current password' })
  @IsString()
  @MinLength(1)
  currentPassword: string;

  @ApiProperty({ description: 'New password (minimum 8 characters)' })
  @IsString()
  @MinLength(8)
  newPassword: string;
}
```

---

### 2. Controller

**Location**: `apps/backend/src/modules/auth/auth.controller.ts`

```typescript
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user password' })
  changePassword(@Req() req: any, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.userId, changePasswordDto);
  }
}
```

---

### 3. Service - Login Flow

**Location**: `apps/backend/src/modules/auth/auth.service.ts`

```typescript
async login(loginDto: LoginDto): Promise<AuthResponse> {
  // 1. Validate user credentials
  const user = await this.validateUser(loginDto.email, loginDto.password);
  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // 2. Create JWT payload
  const payload: JwtPayload = {
    sub: user.id,
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  // 3. Sign access token (expires in 1 day)
  const accessToken = this.jwtService.sign(payload);
  
  // 4. Sign refresh token (expires in 7 days)
  const refreshToken = this.jwtService.sign(payload, {
    privateKey: jwtRefreshConfig.privateKey,
    algorithm: jwtRefreshConfig.signOptions.algorithm,
    expiresIn: jwtRefreshConfig.signOptions.expiresIn,
    issuer: jwtRefreshConfig.signOptions.issuer,
    audience: jwtRefreshConfig.signOptions.audience,
  });

  // 5. Return response
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
```

---

### 4. Service - Register Flow

**Location**: `apps/backend/src/modules/auth/auth.service.ts`

```typescript
async register(registerDto: RegisterDto): Promise<AuthResponse> {
  // 1. Create user (password is hashed in usersService.create)
  const user = await this.usersService.create(registerDto);

  // 2. Create JWT payload (same as login)
  const payload: JwtPayload = {
    sub: user.id,
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  // 3. Sign tokens and return response
  const accessToken = this.jwtService.sign(payload);
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
```

---

### 5. Service - Token Refresh Flow

**Location**: `apps/backend/src/modules/auth/auth.service.ts`

```typescript
async refreshToken(refreshToken: string): Promise<AuthResponse> {
  try {
    // 1. Verify refresh token (using public key)
    const payload = this.jwtService.verify(refreshToken, {
      publicKey: jwtRefreshConfig.publicKey,
      algorithms: jwtRefreshConfig.verifyOptions.algorithms,
      issuer: jwtRefreshConfig.verifyOptions.issuer,
      audience: jwtRefreshConfig.verifyOptions.audience,
    });

    // 2. Fetch updated user info
    const user = await this.usersService.findOne(payload.sub);

    // 3. Generate new tokens
    const newPayload: JwtPayload = {
      sub: user.id,
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const newAccessToken = this.jwtService.sign(newPayload);
    const newRefreshToken = this.jwtService.sign(newPayload, {
      privateKey: jwtRefreshConfig.privateKey,
      algorithm: jwtRefreshConfig.signOptions.algorithm,
      expiresIn: jwtRefreshConfig.signOptions.expiresIn,
      issuer: jwtRefreshConfig.signOptions.issuer,
      audience: jwtRefreshConfig.signOptions.audience,
    });

    // 4. Return response
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
```

---

### 6. Service - Password Validation

**Location**: `apps/backend/src/modules/auth/auth.service.ts`

```typescript
async validateUser(email: string, password: string): Promise<any> {
  // 1. Find user by email
  const user = await this.usersService.findByEmail(email);
  
  // 2. Compare plain password with bcrypt hash
  if (user && (await bcrypt.compare(password, user.password))) {
    return user;
  }
  return null;
}
```

---

### 7. Service - Change Password

**Location**: `apps/backend/src/modules/auth/auth.service.ts`

```typescript
async changePassword(
  userId: string, 
  changePasswordDto: { currentPassword: string; newPassword: string }
): Promise<void> {
  // 1. Fetch user
  const user = await this.usersService.findOne(userId);
  
  // 2. Verify current password
  const isPasswordValid = await bcrypt.compare(
    changePasswordDto.currentPassword, 
    user.password
  );
  if (!isPasswordValid) {
    throw new UnauthorizedException('Current password is incorrect');
  }

  // 3. Update password (hashing happens in usersService.update)
  await this.usersService.update(userId, { 
    password: changePasswordDto.newPassword 
  } as any);
}
```

---

### 8. User Creation with bcrypt Hashing

**Location**: `apps/backend/src/modules/users/users.service.ts`

```typescript
async create(createUserDto: CreateUserDto): Promise<User> {
  // 1. Hash password with bcrypt (salt rounds = 10)
  const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

  // 2. Create user entity
  const user = this.usersRepository.create({
    ...createUserDto,
    password: hashedPassword,
  });

  // 3. Save user to database
  const savedUser = await this.usersRepository.save(user);

  // 4. If user is ADMIN or STAFF, create Employee record
  if (savedUser.role === UserRole.ADMIN || savedUser.role === UserRole.STAFF) {
    try {
      await this.employeesService.create({
        name: savedUser.fullName,
        position: createUserDto.position || 'Staff',
        email: savedUser.email,
        phone: savedUser.phone,
        yearsOfExperience: createUserDto.yearsOfExperience || 0,
        dateOfBirth: savedUser.dateOfBirth,
        userId: savedUser.id,
        status: EmployeeStatus.WORKING,
      });
    } catch (error) {
      // Rollback user creation if employee creation fails
      await this.usersRepository.delete(savedUser.id);
      throw error;
    }
  }

  return savedUser;
}
```

---

### 9. JWT Strategy (Token Verification)

**Location**: `apps/backend/src/modules/auth/strategies/jwt.strategy.ts`

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extract token from "Authorization: Bearer <token>" header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtAccessConfig.publicKey, // Use public key for verification
      algorithms: jwtAccessConfig.verifyOptions.algorithms,
      issuer: jwtAccessConfig.verifyOptions.issuer,
      audience: jwtAccessConfig.verifyOptions.audience,
    });
  }

  // Called after token is successfully verified
  async validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
```

---

### 10. JWT Configuration

**Location**: `apps/backend/src/config/jwt.config.ts`

```typescript
// Keys are read from files on startup
const KEYS_DIR = join(__dirname, '../../keys');

let privateKey: string;
let publicKey: string;

try {
  privateKey = readFileSync(
    process.env.JWT_PRIVATE_KEY_PATH || join(KEYS_DIR, 'jwt-private.key'),
    'utf8',
  );
  publicKey = readFileSync(
    process.env.JWT_PUBLIC_KEY_PATH || join(KEYS_DIR, 'jwt-public.key'),
    'utf8',
  );
} catch (error) {
  throw new Error('RSA keys not found. Generate with:\n' +
    'openssl genrsa -out keys/jwt-private.key 4096 && ' +
    'openssl rsa -in keys/jwt-private.key -pubout -out keys/jwt-public.key');
}

// Access token (short-lived: 1 day)
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

// Refresh token (long-lived: 7 days)
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
```

---

### 11. Module Setup

**Location**: `apps/backend/src/modules/auth/auth.module.ts`

```typescript
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
```

---

## Quick Reference: Field Definitions

### Register Fields
| Field | Type | Example | Notes |
|-------|------|---------|-------|
| fullName | string | "Nguyễn Văn A" | Required, non-empty |
| email | string | "user@example.com" | Required, must be unique |
| password | string | "SecurePass123" | Required, hashed with bcrypt (salt=10) |
| phone | string | "+84912345678" | Required, Vietnamese format |
| dateOfBirth | Date | "1990-01-15" | Required, ISO 8601 format |

### Login Fields
| Field | Type | Example | Notes |
|-------|------|---------|-------|
| email | string | "user@example.com" | Required, must exist |
| password | string | "SecurePass123" | Required, compared with hash |

### Change Password Fields
| Field | Type | Example | Validation |
|-------|------|---------|-----------|
| currentPassword | string | "SecurePass123" | Required, must match |
| newPassword | string | "NewSecurePass456" | Required, min 8 chars |

---

## Key Implementation Details

1. **Password Hashing**: bcrypt with 10 salt rounds
2. **Token Signing**: RSA256 (asymmetric encryption)
3. **Access Token TTL**: 1 day (configurable)
4. **Refresh Token TTL**: 7 days (configurable)
5. **Employee Auto-creation**: When user role is ADMIN or STAFF
6. **Token Verification**: Uses RSA public key
7. **Default User Role**: CUSTOMER
8. **Default User Status**: Active (true)

