/**
 * @file 授权检测卫士
 * @module guards/auth/guard
 */

import { Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    handleRequest(error, auth_info, error_info) {        
        if(auth_info && !error && !error_info) {    //检测通过
            return auth_info;
        }
        else {  //失败
            throw new UnauthorizedException(null, "未授权");
        }
    }
}