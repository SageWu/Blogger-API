/**
 * @file 文章评论实体
 * @module modules/comment/entity
 */

import { Typegoose, prop } from "typegoose";
import { Types } from "mongoose";
import { Article } from "../article/article.model";
import { CommentState } from "./comment.interface";
import { User } from "../user/user.model";

export class Comment extends Typegoose {
    _id?: Types.ObjectId;

    @prop({
        required: true
    })
    content: string;    //内容

    @prop()
    agent?: string;  //ua

    @prop({
        default: CommentState.Published
    })
    state?: CommentState;   //状态

    @prop()
    ip?: string;    //ip

    @prop()
    location?: string;  //地址

    @prop({
        default: Date.now
    })
    create_at?: Date;    //创建日期

    @prop({
        default: Date.now
    })
    update_at?: Date;    //更新日期

    @prop({
        ref: Comment,
        default: null
    })
    parent_id?: Types.ObjectId;  //父级评论

    @prop({
        required: true,
        ref: Article
    })
    article_id: Types.ObjectId; //所属文章

    @prop({
        required: true,
        ref: User
    })
    author_id: Types.ObjectId;  //作者

    @prop({
        required: true,
        ref: User
    })
    user_id: Types.ObjectId;    //用户
}