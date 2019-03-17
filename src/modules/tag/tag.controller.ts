/**
 * @file 文章标签控制器
 * @module modules/tag/controller
 */

import { Controller, Get, Post, HttpStatus, UseGuards, Body, ReflectMetadata, Req, Query, Put, Delete, Param } from "@nestjs/common";
import { Types } from "mongoose";

import * as META from "@src/constants/meta.constant";
import { HTTP } from "@src/decorators/http.decorator";
import { JwtAuthGuard } from "@src/guards/auth.guard";
import { PaginationData } from "@src/interfaces/http.interface";
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
    public getTags(@Req() request, @Query() query): Promise<PaginationData<Tag[]>> {
        query.user_id = Types.ObjectId(request.user);

        return this.tagService.get(query);
    }

    @Get("all")
    @UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "获取所有标签成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "获取所有标签失败")
    public getAllTags(@Req() request): Promise<Tag[]> {
        return this.tagService.getAll(Types.ObjectId(request.user));
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "添加标签成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "添加标签失败")
    public createTag(@Req() request, @Body() tag: Tag): Promise<Tag> {
        tag.user_id = Types.ObjectId(request.user);

        return this.tagService.create(tag).catch(
            (reason) => {
                ReflectMetadata(META.HTTP_IS_ERROR, true)(this.createTag);  //标记失败

                return reason;
            }
        );
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "修改标签成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "修改标签失败")
    public updateTag(@Req() request, @Body() tag: Tag): Promise<Tag> {
        tag.user_id = Types.ObjectId(request.user);

        return this.tagService.update(tag).catch(
            (reason) => {
                ReflectMetadata(META.HTTP_IS_ERROR, true)(this.updateTag);  //标记失败

                return reason;
            }
        );
    }

    @Delete("/:id")
    @UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "删除标签成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "删除标签失败")
    public deleteTag(@Req() request, @Param() param): Promise<boolean> {
        return this.tagService.delete(Types.ObjectId(request.user), param.id);
    }

    @Delete()
    //@UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "批量删除标签成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "批量删除标签失败")
    public deleteTags(@Req() request, @Body() body: Types.ObjectId[]): Promise<boolean> {
        return this.tagService.deleteMany(Types.ObjectId(request.user), body);
    }
}