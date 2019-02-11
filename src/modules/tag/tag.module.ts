/**
 * @file 文章标签模块
 * @module modules/tag/module
 */

import { Module } from "@nestjs/common";
import { TypegooseModule } from "nestjs-typegoose";

import { Tag } from "./tag.model";
import { TagController } from "./tag.controller";
import { TagService } from "./tag.service";

@Module({
    imports: [
        TypegooseModule.forFeature(Tag)
    ],
    controllers: [
        TagController
    ],
    providers: [
        TagService
    ]
})
export class TagModule {}