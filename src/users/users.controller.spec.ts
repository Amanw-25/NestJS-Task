import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const mockUsersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const dto: CreateUserDto = { name: 'John', email: 'john@example.com', password: 'pass123' };
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
    const dto: UpdateUserDto = { name: 'Jane' };
    const updatedUser = { name: 'Jane', email: 'john@example.com', password: 'pass123' };
    mockUsersService.update.mockResolvedValue(updatedUser);
    expect(await controller.update(1, dto)).toEqual(updatedUser);
  });

  it('should delete a user', async () => {
    mockUsersService.remove.mockResolvedValue({ affected: 1 });
    expect(await controller.remove(1)).toEqual({ affected: 1 });
  });
});
