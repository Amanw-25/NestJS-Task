"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const users_service_1 = require("./users.service");
const user_entity_1 = require("./entities/user.entity");
describe('UsersService', () => {
    let service;
    let repository;
    const mockRepository = {
        findOne: jest.fn(),
        find: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                users_service_1.UsersService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(user_entity_1.User),
                    useValue: mockRepository,
                },
            ],
        }).compile();
        service = module.get(users_service_1.UsersService);
        repository = module.get((0, typeorm_1.getRepositoryToken)(user_entity_1.User));
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('create', () => {
        it('should create a new user successfully', async () => {
            const createUserDto = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
            };
            const hashedPassword = 'hashedpassword';
            const savedUser = {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockRepository.findOne.mockResolvedValue(null);
            mockRepository.create.mockReturnValue(savedUser);
            mockRepository.save.mockResolvedValue(savedUser);
            jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
            const result = await service.create(createUserDto);
            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { email: createUserDto.email } });
            expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
            expect(mockRepository.create).toHaveBeenCalledWith({
                name: createUserDto.name,
                email: createUserDto.email,
                password: hashedPassword,
            });
            expect(mockRepository.save).toHaveBeenCalledWith(savedUser);
            expect(result).toBeInstanceOf(user_entity_1.User);
            expect(result.email).toBe(createUserDto.email);
        });
        it('should throw ConflictException if user already exists', async () => {
            const createUserDto = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
            };
            const existingUser = { id: 1, email: 'john@example.com' };
            mockRepository.findOne.mockResolvedValue(existingUser);
            await expect(service.create(createUserDto)).rejects.toThrow(common_1.ConflictException);
            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { email: createUserDto.email } });
        });
    });
    describe('findOne', () => {
        it('should return a user if found', async () => {
            const userId = 1;
            const user = {
                id: userId,
                name: 'John Doe',
                email: 'john@example.com',
                password: 'hashedpassword',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockRepository.findOne.mockResolvedValue(user);
            const result = await service.findOne(userId);
            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
            expect(result).toBeInstanceOf(user_entity_1.User);
            expect(result.id).toBe(userId);
        });
        it('should throw NotFoundException if user not found', async () => {
            const userId = 1;
            mockRepository.findOne.mockResolvedValue(null);
            await expect(service.findOne(userId)).rejects.toThrow(common_1.NotFoundException);
            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
        });
    });
    describe('validatePassword', () => {
        it('should return true for valid password', async () => {
            const plainPassword = 'password123';
            const hashedPassword = 'hashedpassword';
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
            const result = await service.validatePassword(plainPassword, hashedPassword);
            expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
            expect(result).toBe(true);
        });
        it('should return false for invalid password', async () => {
            const plainPassword = 'wrongpassword';
            const hashedPassword = 'hashedpassword';
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
            const result = await service.validatePassword(plainPassword, hashedPassword);
            expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
            expect(result).toBe(false);
        });
    });
});
//# sourceMappingURL=users.service.spec.js.map