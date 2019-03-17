/**
 * @file 浏览记录模块
 * @module modules/log/module
 */

import { Module } from "@nestjs/common";
import { TypegooseModule } from "nestjs-typegoose";
import { LogController } from "./log.controller";
import { LogService } from "./log.service";
import { Log } from "./log.model";

@Module({
    imports: [
        TypegooseModule.forFeature(Log)
    ],
    controllers: [
        LogController
    ],
    providers: [
        LogService
    ]
})
export class LogModule {}