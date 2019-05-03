import { Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { Article } from "@src/modules/article/article.model";
import { ModelType } from "typegoose";
let recommend = require("../recommend");

@Injectable()
export class ContentBasedService {
    constructor(
        @InjectModel(Article) private articleModel: ModelType<Article>
    ) {}

    public async updateTFIDF(): Promise<void> {
        let articles: Article[] = await this.articleModel.find({}, { title: 1, content: 1 }).exec();
        let docs: string[] = [];

        articles.forEach((article: Article) => {
            docs.push(article.content);
        });
        
        recommend.tfidf(docs, articles[0].content, (e) => {
            console.log(e);
        });
        console.log(articles[0].title)
    }

    public recommend(): void {

    }
}