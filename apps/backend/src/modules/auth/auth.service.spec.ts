import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UserRole } from '@shared';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    id: '123',
    email: 'test@vinhxuan.com',
    fullName: 'Test User',
    password: 'hashedPassword',
    role: UserRole.CUSTOMER,
    phone: '0901234567',
    dateOfBirth: new Date('1990-01-01'),
    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password if credentials are valid', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      const result = await service.validateUser('test@vinhxuan.com', 'password');

      expect(result).toBeDefined();
      expect(result.email).toBe('test@vinhxuan.com');
      expect(result.password).toBeUndefined();
    });

    it('should return null if user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser('notfound@vinhxuan.com', 'password');

      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      const result = await service.validateUser('test@vinhxuan.com', 'wrongpassword');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token, refresh token, and user on successful login', async () => {
      const loginDto = {
        email: 'test@vinhxuan.com',
        password: 'password',
      };

      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValueOnce('access_token').mockReturnValueOnce('refresh_token');

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
      expect(result.accessToken).toBe('access_token');
      expect(result.refreshToken).toBe('refresh_token');
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const loginDto = {
        email: 'test@vinhxuan.com',
        password: 'wrongpassword',
      };

      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should create new user and return auth response', async () => {
      const registerDto = {
        fullName: 'New User',
        email: 'newuser@vinhxuan.com',
        password: 'Password@123',
        phone: '0901234567',
        dateOfBirth: '1995-01-01',
      };

      const newUser = { ...mockUser, ...registerDto, id: '456' };
      mockUsersService.create.mockResolvedValue(newUser);
      mockJwtService.sign.mockReturnValueOnce('access_token').mockReturnValueOnce('refresh_token');

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
      expect(mockUsersService.create).toHaveBeenCalledWith(registerDto);
    });
  });
});
