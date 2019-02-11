/**
 * @file 文章标签控制器
 * @module modules/tag/controller
 */

import { Controller, Get, Post, HttpStatus, UseGuards, Body, ReflectMetadata, Req, Query } from "@nestjs/common";
import * as META from "@src/constants/meta.constant";

import { HTTP } from "@src/decorators/http.decorator";
import { JwtAuthGuard } from "@src/guards/auth.guard";
import { Tag } from "./tag.model";
import { TagService } from "./tag.service";

@Controller("tag")
export class TagController {
    constructor(
        private tagService: TagService
    ) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "获取标签成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "获取标签失败")
    public getTags(@Query() query): Promise<Tag[]> {
        return this.tagService.get(query);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "添加标签成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "添加标签失败")
    public createTag(@Req() request, @Body() tag: Tag): Promise<Tag> {
        tag.user_id = request.user;

        return this.tagService.create(tag).catch(
            (reason) => {
                ReflectMetadata(META.HTTP_IS_ERROR, true)(this.createTag);  //标记失败

                return reason;
            }
        );
    }
}