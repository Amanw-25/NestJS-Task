import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';

const mockAuthService = {
  login: jest.fn(),
  signup: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should login a user', async () => {
    const dto: LoginUserDto = { email: 'john@example.com', password: 'pass123' };
    const result = { access_token: 'token' };
    mockAuthService.login.mockResolvedValue(result);
    expect(await controller.login(dto)).toEqual(result);
  });

  it('should signup a user', async () => {
    const dto: CreateUserDto = { name: 'John', email: 'john@example.com', password: 'pass123' };
    const result = { access_token: 'token', user: dto };
    mockAuthService.signup.mockResolvedValue(result);
    expect(await controller.signup(dto)).toEqual(result);
  });
});
