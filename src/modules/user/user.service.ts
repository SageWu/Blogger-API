/**
 * @file 用户服务
 * @module modules/user/servie
 */

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "./user.entity";
import { AuthService } from "../auth/auth.service";

 @Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        private authService: AuthService
    ) {}

    //检查用户是否存在
    public async isExist(account: string): Promise<boolean> {
        let user_find: User = await this.userRepo.findOne({ account: account });

        if(user_find) {
            return Promise.resolve(true);
        }
        else {
            return Promise.resolve(false);
        }
    }

    //获取用户
    public get(user_id: string): Promise<User> {
        return this.userRepo.findOne(user_id).catch(
            (reason) => {
                return Promise.reject("用户不存在");
            }
        );
    }

    //创建用户
    public async create(user: User): Promise<User> {
        let is_exist: boolean = await this.isExist(user.account);   //检验用户是否已存在

        if(is_exist) {
            return Promise.reject("用户已存在");
        }

        user.password = this.authService.encodeMd5(this.authService.decodeBase64(user.password));   //md5密码
        let user_entity = this.userRepo.create(user);

        return this.userRepo.save(user_entity);
    }
}