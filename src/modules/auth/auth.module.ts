/**
 * @file 认证授权模块
 * @module modules/auth/module
 */

import { Module, Global } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import * as APP_CONFIG from "@src/app.config"
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { User } from "../user/user.entity";
import { JwtStrategy } from "./jwt.strategy";

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([User]),   //注册Repository
        PassportModule.register({
            defaultStrategy: "jwt"
        }),
        JwtModule.register({
            secretOrPrivateKey: APP_CONFIG.AUTH.jwtTokenSecret,
            signOptions: {
                expiresIn: APP_CONFIG.AUTH.expiresIn
            }
        })
    ],
    controllers: [
        AuthController
    ],
    providers: [
        AuthService, JwtStrategy
    ],
    exports: [
        AuthService
    ]
})
export class AuthModule {}