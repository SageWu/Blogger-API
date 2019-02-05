/**
 * @file 认证授权控制器
 * @module modules/auth/controller
 */

import { Controller, Post, Body, Query, HttpStatus, ReflectMetadata, UseGuards } from "@nestjs/common";

import * as META from "@src/constants/meta.constant"
import { IpService, IpInfo } from "@src/core/helper/ip.service";
import { HTTP } from "@src/decorators/http.decorator";
import { JwtAuthGuard } from "@src/guards/auth.guard";
import { AuthBody, Token, AuthQuery } from "./auth.interface";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService,
        private ipService: IpService
    ) {}

    //用户认证
    @Post("user")
    @HTTP.Success(HttpStatus.OK, "用户认证成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "用户认证失败")
    public userAuth(@Query() query: AuthQuery, @Body() body: AuthBody): Promise<Token> {
        return this.authService.userAuth(body.account, body.password).then( //认证成功
            async (token: Token) => {
                if(query.ip) {  //记录登录ip
                    let ip_info: IpInfo = await this.ipService.query(query.ip);
                    console.info(`访客:${query.ip}, 位置:${ip_info.country} ${ip_info.city}`);
                    
                    //todo 发送邮件
                }

                return token;
            }
        )
        .catch( //认证失败
            (reason: any) => {
                ReflectMetadata(META.HTTP_IS_ERROR, true)(this.userAuth);  //标记失败

                return reason;
            }
        );
    }

    //todo 管理员认证

    //检测token
    @Post("check")
    @UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "检测通过")
    checkToken(): Promise<string> {
        return Promise.resolve("good job");
    }
}