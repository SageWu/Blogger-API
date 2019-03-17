/**
 * @file 浏览记录控制器
 * @module modules/log/controller
 */

import { Controller, Put, UseGuards, HttpStatus, Req, Body, ReflectMetadata, Get, Param } from "@nestjs/common";
import { Types } from "mongoose";

import { JwtAuthGuard } from "@src/guards/auth.guard";
import { HTTP } from "@src/decorators/http.decorator";
import * as META from "@src/constants/meta.constant";
import { LogService } from "./log.service";
import { Log } from "./log.model";

@Controller("log")
export class LogController {
    constructor(
        private logService: LogService
    ) {}

    @Get("/:id")
    @UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "获取记录成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "获取记录失败")
    public getLog(@Req() request, @Param() param): Promise<Log> {
        return this.logService.getOne(Types.ObjectId(request.user), Types.ObjectId(param.id));
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    @HTTP.Success(HttpStatus.OK, "更新记录成功")
    @HTTP.Error(HttpStatus.BAD_REQUEST, "更新记录失败")
    public updateLog(@Req() request, @Body() log): Promise<Log> {
        log.user_id = Types.ObjectId(request.user);
        log.article_id = Types.ObjectId(log.article_id);

        return this.logService.update(log).catch(
            (reason) => {
                ReflectMetadata(META.HTTP_IS_ERROR, true)(this.updateLog);  //标记失败

                return reason;
            }
        );
    }
}