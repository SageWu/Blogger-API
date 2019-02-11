/**
 * @file 文章标签实体
 * @module modules/tag/entity
 */

import { Typegoose, prop } from "typegoose";
import { Types } from "mongoose";

import { User } from "../user/user.model";

export class Tag extends Typegoose {
    @prop({
        required: true
    })
    name: string;   //名称

    @prop()
    description?: string;    //描述

    @prop({
        default: Date.now
    })
    create_at?: Date;    //创建时间

    @prop({
        default: Date.now
    })
    update_at?: Date;    //修改时间

    @prop({
        required: true,
        ref: User
    })
    user_id: Types.ObjectId;    //所属用户
}