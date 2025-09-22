import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginUserDto: LoginUserDto): Promise<{
        access_token: string;
    }>;
    signup(createUserDto: CreateUserDto): Promise<{
        access_token: string;
        user: import("../users/entities/user.entity").User;
    }>;
}
