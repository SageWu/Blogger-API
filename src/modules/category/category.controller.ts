/**
 * @file 文章目录控制器
 * @module modules/category/controller
 */

import { Controller, Post, UseGuards, Body, Req, ReflectMetadata, HttpStatus, Get, Query, Put, Delete, Param } from "@nestjs/common";
import { Types } from "mongoose";

import * as META from "@src/constants/meta.constant";
import { JwtAuthGuard } from "@src/guards/auth.guard";
import { HTTP } from "@src/decorators/http.decorator";
import { PaginationData } from "@src/interfaces/http.interface";
import { Category } from "./category.model";
import { CategoryService } from "./category.service";

@Controller("category")
export class CategoryController {
    constructor(
        private categoryService: CategoryService
    ) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "获取文章目录成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "获取文章目录失败")
    public getCategories(@Req() request, @Query() query): Promise<PaginationData<Category[]>> {
        query.user_id = Types.ObjectId(request.user);

        return this.categoryService.get(query);
    }

    @Get("all")
    @UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "获取所有文章目录成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "获取所有文章目录失败")
    public getAllCategories(@Req() request): Promise<Category[]> {
        return this.categoryService.getAll(Types.ObjectId(request.user));
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "添加文章目录成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "添加文章目录失败")
    public createCategory(@Req() request, @Body() category: Category): Promise<Category> {
        category.user_id = Types.ObjectId(request.user);

        return this.categoryService.create(category).catch(
            (reason) => {
                ReflectMetadata(META.HTTP_IS_ERROR, true)(this.createCategory);  //标记失败

                return reason;
            }
        );
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "修改文章目录成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "修改文章目录失败")
    public updateCategory(@Req() request, @Body() category: Category): Promise<Category> {
        category.user_id = Types.ObjectId(request.user);

        return this.categoryService.update(category).catch(
            (reason) => {
                ReflectMetadata(META.HTTP_IS_ERROR, true)(this.updateCategory);  //标记失败

                return reason;
            }
        );
    }

    @Delete("/:id")
    @UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "删除文章目录成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "删除文章目录失败")
    public deleteCategory(@Req() request, @Param() param): Promise<boolean> {
        return this.categoryService.delete(Types.ObjectId(request.user), param.id);
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "批量删除文章目录成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "批量删除文章目录失败")
    public deleteCategories(@Req() request, @Body() body: Types.ObjectId[]): Promise<boolean> {
        return this.categoryService.deleteMany(Types.ObjectId(request.user), body);
    }
}