/**
 * @file 文章模块
 * @module modules/article/module
 */

import { Module } from "@nestjs/common";
import { TypegooseModule } from "nestjs-typegoose";

import { ArticleController } from "./article.contoller";
import { ArticleService } from "./article.service";
import { Article } from "./article.model";

@Module({
    imports: [
        TypegooseModule.forFeature(Article)
    ],
    controllers: [
        ArticleController
    ],
    providers: [
        ArticleService
    ]
})
export class ArticleModule {}