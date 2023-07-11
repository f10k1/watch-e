import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService
    ) {}

    async signIn(username: string, password: string): Promise<any> {

        const user = await this.usersService.findOne(username);

        if (!user || !(await bcrypt.compare(password, user.password))) throw new UnauthorizedException();

        const payload = { username: user.username, sub: user.id };

        return {
            token: this.jwtService.sign(payload)
        };
    }
}
