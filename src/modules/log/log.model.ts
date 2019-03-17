/**
 * @file 浏览记录模型
 * @module modules/log/model
 */

import { Typegoose, prop } from "typegoose";
import { Types } from "mongoose";
import { User } from "../user/user.model";
import { Article } from "../article/article.model";

export class Log extends Typegoose {
    _id?: string;

    @prop({
        required: true,
        ref: User
    })
    user_id: Types.ObjectId;   //用户id

    @prop({
        required: true,
        ref: Article
    })
    article_id: Types.ObjectId; //文章id

    @prop({
        default: 1
    })
    count?: number;  //浏览次数

    @prop({
        default: 0
    })
    duration?: number;   //阅读时长(m)

    @prop({
        default: 0
    })
    preference_degree?: number;  //喜欢程度(0:浏览、1:评论、2:点赞)

    @prop({
        default: 1,
        max: 100
    })
    keep?: number;  //衰退保存百分比

    @prop({
        default: Date.now
    })
    create_at?: Date;   //创建时间

    @prop({
        default: Date.now
    })
    update_at?: Date;   //更新时间
}