/**
 * @file 文章控制器
 * @module modules/article/controller
 */

import { Controller, Get, UseGuards, HttpStatus, Query } from "@nestjs/common";
import { ArticleService } from "./article.service";
import { JwtAuthGuard } from "@src/guards/auth.guard";
import { HTTP } from "@src/decorators/http.decorator";

@Controller("article")
export class ArticleController {
    constructor(
        private articleService: ArticleService
    ) {}

    //获取文章
    @Get()
    //@UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "获取文章成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "获取文章失败")
    public getArticles(@Query() query) {
        this.articleService.get();
    }
}