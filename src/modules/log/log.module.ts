/**
 * @file 浏览记录模块
 * @module modules/log/module
 */

import { Module } from "@nestjs/common";
import { TypegooseModule } from "nestjs-typegoose";
import { LogController } from "./log.controller";
import { LogService } from "./log.service";
import { Log } from "./log.model";
import { Article } from "../article/article.model";

@Module({
    imports: [
        TypegooseModule.forFeature(Log),
        TypegooseModule.forFeature(Article)
    ],
    controllers: [
        LogController
    ],
    providers: [
        LogService
    ]
})
export class LogModule {}