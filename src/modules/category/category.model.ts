/**
 * @file 文章类别实体
 * @module modules/category/entity
 */

import { Typegoose, prop } from "typegoose";
import { Types } from "mongoose";

import { User } from "../user/user.model";

export class Category extends Typegoose {
    _id?: Types.ObjectId;

    @prop({
        required: true
    })
    name: string;               //名称

    @prop()
    description?: string;       //描述

    @prop({
        default: 0
    })
    count?: number;             //文章引用数

    @prop({
        default: Date.now
    })
    create_at?: Date;           //创建时间

    @prop({
        default: Date.now
    })
    update_at?: Date;           //更新时间

    @prop({
        ref: Category,
        default: null
    })
    parent_id?: Types.ObjectId; //父类别

    @prop({
        required: true,
        ref: User
    })
    user_id: Types.ObjectId;    //所属用户
}