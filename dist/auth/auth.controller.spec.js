"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const mockAuthService = {
    login: jest.fn(),
    signup: jest.fn(),
};
describe('AuthController', () => {
    let controller;
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [auth_controller_1.AuthController],
            providers: [
                { provide: auth_service_1.AuthService, useValue: mockAuthService },
            ],
        }).compile();
        controller = module.get(auth_controller_1.AuthController);
        service = module.get(auth_service_1.AuthService);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    it('should login a user', async () => {
        const dto = { email: 'john@example.com', password: 'pass123' };
        const result = { access_token: 'token' };
        mockAuthService.login.mockResolvedValue(result);
        expect(await controller.login(dto)).toEqual(result);
    });
    it('should signup a user', async () => {
        const dto = { name: 'John', email: 'john@example.com', password: 'pass123' };
        const result = { access_token: 'token', user: dto };
        mockAuthService.signup.mockResolvedValue(result);
        expect(await controller.signup(dto)).toEqual(result);
    });
});
//# sourceMappingURL=auth.controller.spec.js.map