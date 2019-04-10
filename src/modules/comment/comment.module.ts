/**
 * @file 文章评论模块
 * @module modules/comment/module
 */

import { Module } from "@nestjs/common";
import { TypegooseModule } from "nestjs-typegoose";
import { Comment } from "./comment.model";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";
import { Article } from "../article/article.model";

@Module({
    imports: [
        TypegooseModule.forFeature(Comment),
        TypegooseModule.forFeature(Article)
    ],
    controllers: [
        CommentController
    ],
    providers: [
        CommentService
    ]
})
export class CommentModule {}