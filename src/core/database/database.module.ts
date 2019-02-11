/**
 * @file 数据库模块
 * @module core/database/module
 */

import { Module, Global } from "@nestjs/common";
import { TypegooseModule } from "nestjs-typegoose";

import * as APP_CONFIG from "@src/app.config";

@Global()
@Module({
    imports: [
        TypegooseModule.forRoot(APP_CONFIG.MONGODB.uri, {
            user: APP_CONFIG.MONGODB.username,
            pass: APP_CONFIG.MONGODB.password,
            useCreateIndex: true,
            useFindAndModify: false,
            useNewUrlParser: true,
            promiseLibrary: global.Promise
        })
    ]
})
export class DatabaseModule {}