/**
 * @file 定时任务模块
 * @module core/job/module
 */

import { Module } from "@nestjs/common";
import { TypegooseModule } from "nestjs-typegoose";
import * as schedule from "node-schedule";

import { Log } from "@src/modules/log/log.model";
import { HotService } from "./hot/hot.service";
import { Hot } from "./hot/hot.model";
import { HotController } from "./hot/hot.controller";

@Module({
    imports: [
        TypegooseModule.forFeature(Log),
        TypegooseModule.forFeature(Hot)
    ],
    controllers: [
        HotController
    ],
    providers: [
        HotService
    ]
})
export class JobModule {
    constructor(
        private hotService: HotService
    ) {
        //schedule.scheduleJob("0 0 0 * * *", this.recommendForAllUser.bind(this));
        this.recommendForAllUser();
    }

    public async recommendForAllUser(): Promise<void> {
        console.info("start recommend...");
        await this.hotService.recommend();
        console.info("recommend end...");
    }

    public recommendForActiveUser(): void {

    }
}