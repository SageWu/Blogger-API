/**
 * @file 请求流拦截器
 * @module interceptors/transform/interceptor
 */

import { Injectable, NestInterceptor, ExecutionContext, HttpStatus } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import * as META from "@src/constants/meta.constant"
import { HttpResponse, HttpSuccessResponse, HttpErrorResponse } from "@src/interfaces/http.interface";

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor {
    constructor(
        private reflector: Reflector
    ) {}

    intercept(context: ExecutionContext, call$: Observable<T>): Observable<HttpResponse<T>> {
        let handler = context.getHandler(); //获取处理请求的handler

        return call$.pipe(
            map((value: T) => {
                let is_error: boolean = this.reflector.get<boolean>(META.HTTP_IS_ERROR, handler);

                if(is_error && typeof value === "string") { //判断是否正确响应
                    let code:HttpStatus = this.reflector.get<HttpStatus>(META.HTTP_ERROR_CODE, handler);
                    let message: string = this.reflector.get<string>(META.HTTP_ERROR_MESSAGE, handler);
                    return <HttpErrorResponse>{ statusCode: code, message: message, reason: value };
                }
                else {
                    let code:HttpStatus = this.reflector.get<HttpStatus>(META.HTTP_SUCCESS_CODE, handler);
                    let message: string = this.reflector.get<string>(META.HTTP_SUCCESS_MESSAGE, handler);
                    return <HttpSuccessResponse<T>>{ statusCode: code, message: message, result: value };
                }
            })
        );
    }
}