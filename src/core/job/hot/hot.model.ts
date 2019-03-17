/**
 * @file 热门文章集合模型
 * @module core/job/hot/model
 */

import { Typegoose, prop } from "typegoose";
import { Types } from "mongoose";
import { Article } from "@src/modules/article/article.model";

export class Hot extends Typegoose {
    _id?: Types.ObjectId;

    @prop({
        required: true,
        ref: Article
    })
    article_id: Types.ObjectId;

    @prop({
        default: Date.now()
    })
    create_at?: Date;

    @prop({
        default: Date.now()
    })
    update_at?: Date;

    article?: Article
}