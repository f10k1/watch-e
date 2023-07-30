import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import "dotenv/config";
import { AuthGuard } from './auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            "type": "postgres",
            "host": process.env.DB_HOST,
            "port": Number(process.env.DB_PORT),
            "username": process.env.DB_USER,
            "password": process.env.DB_PASSWORD,
            "database": process.env.DB,
            "entities": ["./**/*.entity.js"],
        }),
        UserModule,
        AuthModule
    ],
    providers: [
        JwtService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard
        }
    ]
})
export class AppModule { }
