/**
 * @file 授权检测策略
 * @module modules/auth/jwt-strategy
 */

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import * as lodash from "lodash";

import * as APP_CONFIG from "@src/app.config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),   //从请求头中获取token
            secretOrKey: APP_CONFIG.AUTH.jwtTokenSecret
        });
    }

    validate(payload: any) {    //成功解析token后
        if(lodash.isEqual(payload.data, APP_CONFIG.AUTH.data)) {
            return payload.owner;
        }
        else {            
            throw new UnauthorizedException({ name: "JsonWebTokenError", message: "invalid data" });
        }
    }
}