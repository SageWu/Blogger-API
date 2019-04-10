/**
 * @file 个性推荐文章控制器
 * @module modules/recommend/controller
 */

import { Controller, Get, UseGuards, HttpStatus, Query, Req } from "@nestjs/common";
import { Types } from "mongoose";

import { JwtAuthGuard } from "@src/guards/auth.guard";
import { HTTP } from "@src/decorators/http.decorator";
import { PaginationData } from "@src/interfaces/http.interface";
import { Article } from "@src/modules/article/article.model";
import { RecommendService } from "./recommend.service";

@Controller("recommend")
export class RecommendController {
    constructor(
        private recommendService: RecommendService
    ) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "获取个性推荐文章列表成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "获取个性推荐文章列表失败")
    public getHots(@Req() request, @Query() query): Promise<PaginationData<Article[]>> {
        query.user_id = Types.ObjectId(request.user);

        return this.recommendService.get(query);
    }
}