import { Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ModelType } from "typegoose";

import { Article } from "./article.model";
import { PublishState, Origin } from "./article.interface";

@Injectable()
export class ArticleService {
    constructor(
        @InjectModel(Article) private articleModel: ModelType<Article>
    ) {}

    //获取文章
    public async get() {
        let article: Article = await new this.articleModel({
            title: "hello",
            content: "hello",
            state: PublishState.Draft,
            origin: Origin.Original,
            categories: [],
            tags: []
        }).save();
    }
}