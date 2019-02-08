import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Article } from "./article.entity";
import { Repository } from "typeorm";
import { PublishState, Origin } from "./article.interface";

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(Article) private articleRep: Repository<Article>
    ) {}

    //获取文章
    public get() {
        let article: Article = this.articleRep.create({
            title: "hello",
            content: "hello",
            state: PublishState.Draft,
            origin: Origin.Original,
            categories: [],
            tags: []
        });

        this.articleRep.save(article);
    }
}