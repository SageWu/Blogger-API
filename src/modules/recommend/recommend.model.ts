/**
 * @file 推荐文章模型
 * @module modules/recommend/model
 */

import { Typegoose, prop } from "typegoose";
import { Types } from "mongoose";
import { User } from "../user/user.model";
import { Article } from "../article/article.model";

export class Recommend extends Typegoose {
    _id?: Types.ObjectId;

    @prop({
        required: true,
        ref: User
    })
    user_id: Types.ObjectId;    //用户id

    @prop({
        required: true,
        ref: Article
    })
    article_id: Types.ObjectId; //文章id

    @prop({
        default: 0
    })
    score?: number;             //分数

    @prop({
        default: Date.now()
    })
    create_at?: Date;           //创建日期

    @prop({
        default: Date.now()
    })
    update_at?: Date;           //更新日期
}