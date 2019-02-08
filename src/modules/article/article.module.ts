/**
 * @file 文章模块
 * @module modules/article/module
 */

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ArticleController } from "./article.contoller";
import { ArticleService } from "./article.service";
import { Article } from "./article.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Article])
    ],
    controllers: [
        ArticleController
    ],
    providers: [
        ArticleService
    ]
})
export class ArticleModule {}