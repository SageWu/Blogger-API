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
import { CollaborativeFilterService } from "./cf/cf.service";
import { Recommend } from "@src/modules/recommend/recommend.model";
import { ContentBasedService } from "./cb/cb.service";
import { Article } from "@src/modules/article/article.model";

@Module({
    imports: [
        TypegooseModule.forFeature(Log),
        TypegooseModule.forFeature(Hot),
        TypegooseModule.forFeature(Recommend),
        TypegooseModule.forFeature(Article)
    ],
    controllers: [
        HotController
    ],
    providers: [
        HotService,
        CollaborativeFilterService,
        ContentBasedService
    ]
})
export class JobModule {
    constructor(
        private hotService: HotService,
        private cfService: CollaborativeFilterService,
        private cbService: ContentBasedService
    ) {
        //schedule.scheduleJob("0 0 0 * * *", this.recommendForAllUser.bind(this));
        this.recommendForAllUser();
    }

    public recommendForAllUser(): void {
        console.info("start recommend...");
        // this.hotService.recommend();
        // this.cfService.recommend();
        this.cbService.updateTFIDF();
        this.cbService.recommend();
        //console.info("recommend end...");
    }

    public recommendForActiveUser(): void {

    }
}