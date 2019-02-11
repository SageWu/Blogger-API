/**
 * @file 用户控制器
 * @module modules/user/controller
 */

import { Controller, Post, HttpStatus, Body, ReflectMetadata, Get, UseGuards, Req, Query } from "@nestjs/common";

import * as META from "@src/constants/meta.constant"
import { HTTP } from "@src/decorators/http.decorator";
import { JwtAuthGuard } from "@src/guards/auth.guard";
import { User } from "./user.model";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
    constructor(
        private userService: UserService,
    ) {}

    //检查用户是否已经存在
    @Get("exist")
    @HTTP.Success(HttpStatus.OK, "检查成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "检查失败")
    public isUserExist(@Query() query): Promise<boolean> {
        if(!query.account) {
            return Promise.resolve(false);
        }

        return this.userService.isExist(query.account);
    }

    //获取用户
    @Get()
    @UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "获取用户成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "获取用户失败")
    public getUser(@Req() request): Promise<User> {
        return this.userService.get(request.user).catch(
            (reason: any) => {
                ReflectMetadata(META.HTTP_IS_ERROR, true)(this.createUser);  //标记失败

                return reason;
            }
        );
    }

    //创建用户
    @Post()
    @HTTP.Success(HttpStatus.OK, "创建用户成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "创建用户失败")
    public createUser(@Body() body: User): Promise<User> {
        return this.userService.create(body).catch(
            (reason: any) => {
                ReflectMetadata(META.HTTP_IS_ERROR, true)(this.createUser);  //标记失败

                return reason;
            }
        );
    }
}