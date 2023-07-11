
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
    imports: [UserModule, JwtModule.register({
        global: true,
        secret: process.env.JWT_KEY,
        signOptions: { expiresIn: "60s" }
    })],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule { }
