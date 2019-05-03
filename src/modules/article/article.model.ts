/**
 * @file 文章实体
 * @module modules/article/entity
 */

import { Typegoose, prop, Ref, arrayProp } from "typegoose";
import { Types } from "mongoose";

import { PublishState, Origin } from "./article.interface";
import { Category } from "../category/category.model";
import { Tag } from "../tag/tag.model";
import { User } from "../user/user.model";

/**
 * 关键字接口
 */
export class Keyworld {
    public keyworld: string;
    public score: number;
}

export class Article extends Typegoose {
    _id?: Types.ObjectId;

    @prop({
        required: true
    })
    title: string;  //标题

    @prop({
        required: true
    })
    content: string;    //内容

    @arrayProp({
        items: Keyworld
    })
    keyworlds?: Keyworld[];

    @prop()
    thumb?: string;  //缩略图

    @prop({
        required: true
    })
    state: PublishState;    //发布状态

    @prop({
        required: true
    })
    origin: Origin  //文章源

    @prop({
        default: 0
    })
    views?: number;   //阅读数量

    @prop({
        default: 0
    })
    likes?: number;   //喜欢数量

    @prop({
        default: 0
    })
    comments_num?: number;   //评论数量

    @prop({
        default: Date.now
    })
    create_at?: Date;    //创建时间

    @prop({
        default: Date.now
    })
    update_at?: Date;    //更新时间

    @prop({
        ref: User,
        required: true
    })
    user_id: Types.ObjectId;    //所属用户

    @arrayProp({
        itemsRef: Category,
        default: []
    })
    categories?: Ref<Category>[]; //文章所属类别

    @arrayProp({
        itemsRef: Tag,
        default: []
    })
    tags?: Ref<Tag>[];    //文章包含标签
}