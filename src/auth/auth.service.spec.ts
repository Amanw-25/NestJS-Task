import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    validatePassword: jest.fn(),
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

  describe('login', () => {
    it('should return access token for valid credentials', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'john@example.com',
        password: 'password123',
      };

      const user = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedpassword',
      };

      const token = 'jwt-token';

      mockUsersService.findByEmail.mockResolvedValue(user);
      mockUsersService.validatePassword.mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue(token);

      const result = await service.login(loginUserDto);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(loginUserDto.email);
      expect(mockUsersService.validatePassword).toHaveBeenCalledWith(loginUserDto.password, user.password);
      expect(mockJwtService.sign).toHaveBeenCalledWith({ email: user.email, sub: user.id });
      expect(result).toEqual({ access_token: token });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };

      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginUserDto)).rejects.toThrow(UnauthorizedException);
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(loginUserDto.email);
    });
  });

  describe('signup', () => {
    it('should create user and return access token', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const createdUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const token = 'jwt-token';

      mockUsersService.create.mockResolvedValue(createdUser);
      mockJwtService.sign.mockReturnValue(token);

      const result = await service.signup(createUserDto);

      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
      expect(mockJwtService.sign).toHaveBeenCalledWith({ email: createdUser.email, sub: createdUser.id });
      expect(result).toEqual({
        access_token: token,
        user: createdUser,
      });
    });
  });

  describe('validateUser', () => {
    it('should return user without password for valid credentials', async () => {
      const email = 'john@example.com';
      const password = 'password123';
      const user = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedpassword',
      };

      mockUsersService.findByEmail.mockResolvedValue(user);
      mockUsersService.validatePassword.mockResolvedValue(true);

      const result = await service.validateUser(email, password);

      expect(result).toEqual({
        id: user.id,
        name: user.name,
        email: user.email,
      });
      expect(result.password).toBeUndefined();
    });

    it('should return null for invalid credentials', async () => {
      const email = 'john@example.com';
      const password = 'wrongpassword';

      mockUsersService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser(email, password);

      expect(result).toBeNull();
    });
  });
});