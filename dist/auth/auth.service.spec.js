"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const users_service_1 = require("../users/users.service");
describe('AuthService', () => {
    let service;
    let usersService;
    let jwtService;
    const mockUsersService = {
        findByEmail: jest.fn(),
        validatePassword: jest.fn(),
        create: jest.fn(),
    };
    const mockJwtService = {
        sign: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                {
                    provide: users_service_1.UsersService,
                    useValue: mockUsersService,
                },
                {
                    provide: jwt_1.JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
        usersService = module.get(users_service_1.UsersService);
        jwtService = module.get(jwt_1.JwtService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('login', () => {
        it('should return access token for valid credentials', async () => {
            const loginUserDto = {
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
            const loginUserDto = {
                email: 'john@example.com',
                password: 'wrongpassword',
            };
            mockUsersService.findByEmail.mockResolvedValue(null);
            await expect(service.login(loginUserDto)).rejects.toThrow(common_1.UnauthorizedException);
            expect(mockUsersService.findByEmail).toHaveBeenCalledWith(loginUserDto.email);
        });
    });
    describe('signup', () => {
        it('should create user and return access token', async () => {
            const createUserDto = {
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
//# sourceMappingURL=auth.service.spec.js.map