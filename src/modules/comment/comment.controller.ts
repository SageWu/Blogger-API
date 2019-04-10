/**
 * @file 文章评论控制器
 * @module modules/comment/controller
 */

import { Controller, Get, UseGuards, HttpStatus, Query, Req, Post, Body, ReflectMetadata, Put } from "@nestjs/common";
import { Types } from "mongoose";

import * as META from "@src/constants/meta.constant";
import { JwtAuthGuard } from "@src/guards/auth.guard";
import { HTTP } from "@src/decorators/http.decorator";
import { PaginationData } from "@src/interfaces/http.interface";
import { Comment } from "./comment.model";
import { CommentService } from "./comment.service";
import { CommentState } from "./comment.interface";

@Controller("comment")
export class CommentController {
    constructor(
        private commentService: CommentService
    ) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "获取文章评论成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "获取文章评论失败")
    public getComments(@Req() request, @Query() query): Promise<PaginationData<Comment[]>> {
        //todo 检查查询参数
        if(query.no_back) {
            if(query.state !== CommentState.Published.toString()) {   //只允许查看显示状态的评论
                ReflectMetadata(META.HTTP_IS_ERROR, true)(this.getComments);  //标记失败
                return Promise.reject("查询参数有误");
            }
        }
        else {
            query.user_id = Types.ObjectId(request.user);
        }
        
        return this.commentService.get(query);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "添加文章评论成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "添加文章评论失败")
    public createComment(@Req() request, @Body() comment: Comment): Promise<Comment> {
        //console.log(request)

        comment.user_id = Types.ObjectId(request.user);

        return this.commentService.create(comment).catch(
            (reason) => {
                ReflectMetadata(META.HTTP_IS_ERROR, true)(this.createComment);  //标记失败

                return reason;
            }
        );
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "修改文章评论成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "修改文章评论失败")
    public updateComment(@Req() request, @Body() comment: Comment): Promise<Comment> {
        comment.author_id = Types.ObjectId(request.user);

        return this.commentService.update(comment).catch(
            (reason) => {
                ReflectMetadata(META.HTTP_IS_ERROR, true)(this.updateComment);  //标记失败

                return reason;
            }
        );
    }

    @Put("many")
    @UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "批量修改文章评论成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "批量修改文章评论失败")
    public updateComments(@Req() request, @Body() comments: Comment[]): Promise<boolean> {
        comments.forEach(
            (comment: Comment) => {
                comment.author_id = Types.ObjectId(request.user);
            }
        );

        return this.commentService.updateMany(comments);
    }
}