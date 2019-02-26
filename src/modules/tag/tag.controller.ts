/**
 * @file 文章标签控制器
 * @module modules/tag/controller
 */

import { Controller, Get, Post, HttpStatus, UseGuards, Body, ReflectMetadata, Req, Query, Put, Delete, Param } from "@nestjs/common";
import * as META from "@src/constants/meta.constant";

import { HTTP } from "@src/decorators/http.decorator";
import { JwtAuthGuard } from "@src/guards/auth.guard";
import { Tag } from "./tag.model";
import { TagService } from "./tag.service";
import { PaginationData } from "@src/interfaces/http.interface";
import { Types } from "mongoose";

@Controller("tag")
export class TagController {
    constructor(
        private tagService: TagService
    ) {}

    @Get()
    //@UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "获取标签成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "获取标签失败")
    public getTags(@Req() request, @Query() query): Promise<PaginationData<Tag[]>> {
        query.user_id = "5c6180ea67e9335c15af5118";//request.user;
        //todo 检查查询参数

        return this.tagService.get(query);
    }

    @Post()
    //@UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "添加标签成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "添加标签失败")
    public createTag(@Req() request, @Body() tag: Tag): Promise<Tag> {
        tag.user_id = Types.ObjectId("5c6180ea67e9335c15af5118");//request.user;

        return this.tagService.create(tag).catch(
            (reason) => {
                ReflectMetadata(META.HTTP_IS_ERROR, true)(this.createTag);  //标记失败

                return reason;
            }
        );
    }

    @Put()
    //@UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "修改标签成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "修改标签失败")
    public updateTag(@Body() tag: Tag): Promise<Tag> {
        return this.tagService.update(tag).catch(
            (reason) => {
                ReflectMetadata(META.HTTP_IS_ERROR, true)(this.updateTag);  //标记失败

                return reason;
            }
        );
    }

    @Delete("/:id")
    //@UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "删除标签成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "删除标签失败")
    public deleteTag(@Param() param): Promise<boolean> {
        return this.tagService.delete(param.id);
    }

    @Delete()
    //@UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "删除标签成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "删除标签失败")
    public deleteTags(@Body() body): Promise<boolean> {
        return this.tagService.deleteMany(body);
    }
}