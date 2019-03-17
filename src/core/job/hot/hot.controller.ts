/**
 * @file 热门文章控制器
 * @module core/job/hot/controller
 */

import { Controller, Get, UseGuards, HttpStatus, Query } from "@nestjs/common";
import { JwtAuthGuard } from "@src/guards/auth.guard";
import { HTTP } from "@src/decorators/http.decorator";
import { PaginationData } from "@src/interfaces/http.interface";
import { Article } from "@src/modules/article/article.model";
import { HotService } from "./hot.service";

@Controller("hot")
export class HotController {
    constructor(
        private hotService: HotService
    ) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "获取热门文章列表成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "获取热门文章列表失败")
    public getHots(@Query() query): Promise<PaginationData<Article[]>> {
        return this.hotService.get(query);
    }
}