"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const users_controller_1 = require("./users.controller");
const users_service_1 = require("./users.service");
const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
};
describe('UsersController', () => {
    let controller;
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [users_controller_1.UsersController],
            providers: [
                { provide: users_service_1.UsersService, useValue: mockUsersService },
            ],
        }).compile();
        controller = module.get(users_controller_1.UsersController);
        service = module.get(users_service_1.UsersService);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    it('should create a user', async () => {
        const dto = { name: 'John', email: 'john@example.com', password: 'pass123' };
        mockUsersService.create.mockResolvedValue(dto);
        expect(await controller.create(dto)).toEqual(dto);
    });
    it('should return all users', async () => {
        const users = [{ name: 'John', email: 'john@example.com', password: 'pass123' }];
        mockUsersService.findAll.mockResolvedValue(users);
        expect(await controller.findAll()).toEqual(users);
    });
    it('should return one user', async () => {
        const user = { name: 'John', email: 'john@example.com', password: 'pass123' };
        mockUsersService.findOne.mockResolvedValue(user);
        expect(await controller.findOne(1)).toEqual(user);
    });
    it('should update a user', async () => {
        const dto = { name: 'Jane' };
        const updatedUser = { name: 'Jane', email: 'john@example.com', password: 'pass123' };
        mockUsersService.update.mockResolvedValue(updatedUser);
        expect(await controller.update(1, dto)).toEqual(updatedUser);
    });
    it('should delete a user', async () => {
        mockUsersService.remove.mockResolvedValue({ affected: 1 });
        expect(await controller.remove(1)).toEqual({ affected: 1 });
    });
});
//# sourceMappingURL=users.controller.spec.js.map