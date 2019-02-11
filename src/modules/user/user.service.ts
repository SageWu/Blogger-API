/**
 * @file 用户服务
 * @module modules/user/servie
 */

import { Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ModelType } from "typegoose";

import { User } from "./user.model";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User) private userModel: ModelType<User>,
        private authService: AuthService
    ) {}

    //检查用户是否存在
    public async isExist(account: string): Promise<boolean> {
        let found_user: User = await this.userModel.findOne({ account: account }).exec();
        
        if(found_user) {
            return Promise.resolve(true);
        }
        else {
            return Promise.resolve(false);
        }
    }

    //获取用户
    public async get(user_id: string): Promise<User> {
        let user: User = await this.userModel.findById(user_id).exec();
        
        if(user) {
            return Promise.resolve(user);
        }
        else {
            return Promise.reject("用户不存在");
        }
    }

    //创建用户
    public async create(user: User): Promise<User> {
        let is_exist: boolean = await this.isExist(user.account);   //检验用户是否已存在
        if(is_exist) {
            return Promise.reject("用户已存在");
        }

        user.password = this.authService.encodeMd5(this.authService.decodeBase64(user.password));   //md5密码
        return this.userModel.create(user).catch(   //创建失败抛异常
            (reason) => {
                return Promise.reject(reason["message"]);
            }
        );
    }
}