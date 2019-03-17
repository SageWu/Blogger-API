/**
 * @file 文章控制器
 * @module modules/article/controller
 */

import { Controller, Get, UseGuards, HttpStatus, Query, Post, Req, Body, ReflectMetadata, Put, Delete, Param } from "@nestjs/common";
import { Types } from "mongoose";

import * as META from "@src/constants/meta.constant";
import { JwtAuthGuard } from "@src/guards/auth.guard";
import { HTTP } from "@src/decorators/http.decorator";
import { PaginationData } from "@src/interfaces/http.interface";
import { Article } from "./article.model";
import { ArticleService } from "./article.service";
import { PublishState } from "./article.interface";

@Controller("article")
export class ArticleController {
    constructor(
        private articleService: ArticleService
    ) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "获取文章成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "获取文章失败")
    public getArticles(@Req() request, @Query() query): Promise<PaginationData<Article[]>> {
        //todo 检查查询参数
        if(query.no_back) {
            if(query.state !== PublishState.Published.toString()) {   //只允许查看发布状态的文章
                ReflectMetadata(META.HTTP_IS_ERROR, true)(this.getArticles);  //标记失败
                return Promise.reject("查询参数有误");
            }
        }
        else {
            query.user_id = Types.ObjectId(request.user);
        }
        
        return this.articleService.get(query);
    }

    @Get("/:id")
    @UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "获取文章成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "获取文章失败")
    public getArticle(@Req() request, @Param() param): Promise<Article> {
        return this.articleService.getOne(Types.ObjectId(request.user), param.id).catch(
            (reason) => {
                ReflectMetadata(META.HTTP_IS_ERROR, true)(this.getArticle);  //标记失败

                return reason;
            }
        );
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "添加文章成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "添加文章失败")
    public createArticle(@Req() request, @Body() article: Article): Promise<Article> {
        article.user_id = Types.ObjectId(request.user);

        return this.articleService.create(article).catch(
            (reason) => {
                ReflectMetadata(META.HTTP_IS_ERROR, true)(this.createArticle);  //标记失败

                return reason;
            }
        );
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "修改文章成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "修改文章失败")
    public updateArticle(@Req() request, @Body() article: Article): Promise<Article> {
        article.user_id = Types.ObjectId(request.user);

        return this.articleService.update(article).catch(
            (reason) => {
                ReflectMetadata(META.HTTP_IS_ERROR, true)(this.updateArticle);  //标记失败

                return reason;
            }
        );
    }

    @Put("many")
    @UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "批量修改文章成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "批量修改文章失败")
    public updateArticles(@Req() request, @Body() articles: Article[]): Promise<boolean> {
        articles.forEach(
            (article: Article) => {
                article.user_id = Types.ObjectId(request.user);
            }
        );

        return this.articleService.updateMany(articles);
    }

    @Delete("/:id")
    @UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "删除文章成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "删除文章失败")
    public deleteArticle(@Req() request, @Param() param): Promise<boolean> {
        return this.articleService.delete(Types.ObjectId(request.user), param.id);
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "批量删除文章成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "批量删除文章失败")
    public deleteArticles(@Req() request, @Body() body: Types.ObjectId[]): Promise<boolean> {
        return this.articleService.deleteMany(Types.ObjectId(request.user), body);
    }
}