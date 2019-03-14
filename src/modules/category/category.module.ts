/**
 * @file 文章目录模块
 * @module modules/category/module
 */

import { Module } from "@nestjs/common";
import { TypegooseModule } from "nestjs-typegoose";
import { Category } from "./category.model";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { Article } from "../article/article.model";

@Module({
    imports: [
        TypegooseModule.forFeature(Category),
        TypegooseModule.forFeature(Article)
    ],
    controllers: [
        CategoryController
    ],
    providers: [
        CategoryService
    ]
})
export class CategoryModule {}