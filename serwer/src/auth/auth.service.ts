import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

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
            if (!user || !(await bcrypt.compare(password, user.password))) throw new UnauthorizedException({
                message: {
                    auth: "Wrong username or password"
                },
                statusCode: HttpStatus.UNAUTHORIZED
            });
            const payload = { username: user.username, sub: user.id };

            return {
                token: this.jwtService.sign(payload)
            };
        }
        catch {
            throw new UnauthorizedException({
                message: {
                    auth: "Wrong username or password"
                },
                statusCode: HttpStatus.UNAUTHORIZED
            });
        }
    }

    async getUser(token: string): Promise<any> {

        try {
            const valid = this.jwtService.verify(token);

            if (valid) {
                const user = await this.usersService.findOne(valid.username);
                delete user.password;
                return user;
            }

            throw new BadRequestException({ message: { "token": "Your token is invalid" } });
        }
        catch (err) {
            console.log(err)
            throw new BadRequestException({ message: { "token": "Your token is invalid" } });
        }



    }
}
