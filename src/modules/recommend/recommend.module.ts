/**
 * @file 个性推荐文章模块
 * @module modules/recommend/module
 */

import { Module } from "@nestjs/common";
import { TypegooseModule } from "nestjs-typegoose";

import { Recommend } from "./recommend.model";
import { RecommendController } from "./recommend.controller";
import { RecommendService } from "./recommend.service";

@Module({
    imports: [
        TypegooseModule.forFeature(Recommend)
    ],
    controllers: [
        RecommendController
    ],
    providers: [
        RecommendService
    ]
})
export class RecommendModule {}