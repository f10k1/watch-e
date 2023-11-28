
import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './user.entity';
import { UserController } from './user.controller';
import { UserGateway } from './user.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { DeviceModule } from 'src/device/device.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Account]),
        forwardRef(() => AuthModule),
        forwardRef(() => DeviceModule),
    ],
    controllers: [UserController],
    providers: [UserService, UserGateway],
    exports: [UserService, UserGateway]
})
export class UserModule { }
