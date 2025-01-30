import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

type AuthInput = { username: string; password: string };
type SignInData = { userId: number; username: string };
type AuthResult = { success: boolean; accessToken: string; user?: SignInData };

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async authenticate(input: AuthInput): Promise<AuthResult> {
        const user = await this.validateUser(input);
        if (!user) {
            throw new UnauthorizedException();
        }

        return {
            success: true,
            accessToken: 'fake-access-token',
            user,
        }
    }

    async validateUser(input : AuthInput): Promise<SignInData | null> {
        const user = await this.usersService.findUserByName(input.username);
        if (user && user.password === input.password) {
            const { userId, username } = user;
            return { userId, username };
        }
        return null;
    }
}
