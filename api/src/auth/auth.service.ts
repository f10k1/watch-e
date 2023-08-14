import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Account } from 'src/user/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService
    ) { }

    async signIn(username: string, password: string): Promise<any> {

        const user = await this.usersService.findOne(username);

        try {
            console.log(username, password);
            if (!user || !(await bcrypt.compare(password, user.password))) throw new UnauthorizedException({ auth: "Wrong username or password" });
            const payload = { username: user.username, sub: user.id };

            delete user.password;

            return {
                token: this.jwtService.sign(payload),
                ...user
            };
        }
        catch {
            throw new UnauthorizedException({ auth: "Wrong username or password" });
        }
    }

    async getUser(token: string): Promise<Account | null> {

        try {
            const valid = this.jwtService.verify(token);

            if (valid) {
                const user = await this.usersService.findOne(valid.username);
                delete user.password;
                user["token"] = token;
                return user;
            }

            return null;
        }
        catch (err) {
            return null;
        }
    }
}
