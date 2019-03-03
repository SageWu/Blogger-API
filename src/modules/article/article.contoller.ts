/**
 * @file 文章控制器
 * @module modules/article/controller
 */

import { Controller, Get, UseGuards, HttpStatus, Query, Post, Req, Body, ReflectMetadata, Put } from "@nestjs/common";
import { Types } from "mongoose";

import * as META from "@src/constants/meta.constant";
import { JwtAuthGuard } from "@src/guards/auth.guard";
import { HTTP } from "@src/decorators/http.decorator";
import { Article } from "./article.model";
import { ArticleService } from "./article.service";
import { PaginationData } from "@src/interfaces/http.interface";

@Controller("article")
export class ArticleController {
    constructor(
        private articleService: ArticleService
    ) {}

    @Get()
    //@UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "获取文章成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "获取文章失败")
    public getArticles(@Req() request, @Query() query): Promise<PaginationData<Article[]>> {
        query.user_id = "5c6180ea67e9335c15af5118";//request.user;
        //todo 检查查询参数

        return this.articleService.get(query);
    }

    @Post()
    // @UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "添加文章成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "添加文章失败")
    public createArticle(@Req() request, @Body() article: Article): Promise<Article> {
        article.user_id = Types.ObjectId("5c6180ea67e9335c15af5118");//request.user;

        return this.articleService.create(article).catch(
            (reason) => {
                ReflectMetadata(META.HTTP_IS_ERROR, true)(this.createArticle);  //标记失败

                return reason;
            }
        );
    }

    @Put()
    // @UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "修改文章成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "修改文章失败")
    public updateArticle(@Req() request, @Body() article: Article): Promise<Article> {
        return this.articleService.update(article).catch(
            (reason) => {
                ReflectMetadata(META.HTTP_IS_ERROR, true)(this.updateArticle);  //标记失败

                return reason;
            }
        );
    }
}