/**
 * @file 认证授权服务
 * @module modules/auth/service
 */

import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { createHash } from "crypto";
import { Base64 } from "js-base64";
import { InjectModel } from "nestjs-typegoose";
import { ModelType } from "typegoose";

import * as APP_CONFIG from "@src/app.config";
import { Token } from "./auth.interface";
import { User } from "../user/user.model";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User) private userModel: ModelType<User>,
        private jwtService: JwtService
    ) {}
    
    //base64解码
    public decodeBase64(str: string): string {
        return str? Base64.decode(str): str;
    }

    //md5编码
    public encodeMd5(str: string): string {
        return str? createHash("md5").update(str).digest("hex"): str;
    }

    //用户认证
    public async userAuth(account: string, password: string): Promise<Token> {        
        password = this.encodeMd5(this.decodeBase64(password));

        let user: User = await this.userModel.findOne({ "account": account, "password": password }).exec();
        if(user) {
            let token: Token = {};
            token.accessToken = this.jwtService.sign({ data: APP_CONFIG.AUTH.data, owner: user["_id"] });
            token.expiresIn = APP_CONFIG.AUTH.expiresIn;

            return Promise.resolve(token);
        }
        else {
            return Promise.reject("帐号或密码错误");
        }
    }

    //todo 管理员认证
}