/**
 * @file 用户控制器
 * @module modules/user/controller
 */

import { Controller, Post, HttpStatus, Body, ReflectMetadata } from "@nestjs/common";

import * as META from "@src/constants/meta.constant"
import { HTTP } from "@src/decorators/http.decorator";
import { User } from "./user.entity";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
    constructor(
        private userService: UserService
    ) {}

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