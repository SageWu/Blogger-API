/**
 * @file 跨域处理中间件
 * @module middlewares/cors/middleware
 */

import { Injectable, NestMiddleware, MiddlewareFunction, RequestMethod, HttpStatus } from "@nestjs/common";

import * as APP_CONFIG from "@src/app.config";
import { isDevMode } from "@src/app.environment";

@Injectable()
export class CorsMiddleware implements NestMiddleware {
    resolve(): MiddlewareFunction {
        return (req, res, next) => {
            let origin: string = req.headers.origin || "";
            let allowed_origins: string[] = APP_CONFIG.CORS.allowedOrigins;
            let allowed_methods: RequestMethod[] = APP_CONFIG.CORS.allowedMethods;
            let allowed_headers: string[] = APP_CONFIG.CORS.allowedHeaders;

            //允许源
            let index: number = allowed_origins.findIndex((value: string): boolean => value === origin);
            if(!origin || index !== -1 || isDevMode) {
                res.setHeader("Access-Control-Allow-Origin", origin || "*");
            }

            //设置头部信息
            res.header("Access-Control-Allow-Headers", allowed_headers.join(','));
            res.header("Access-Control-Allow-Methods", allowed_methods.map((value: RequestMethod): string => RequestMethod[value]).join(','));
            res.header("Access-Control-Max-Age", "86400");  //老化时间1天
            res.header("Content-Type", "application/json; charset=utf-8");
            res.header("X-Powered-By", `${APP_CONFIG.INFO.name} ${APP_CONFIG.INFO.version}`);

            //如果是option请求
            if(req.method === RequestMethod[RequestMethod.OPTIONS]) {
                return res.sendStatus(HttpStatus.NO_CONTENT);
            }
            else {
                return next();
            }
        }
    }
}