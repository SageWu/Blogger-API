import { Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ModelType } from "typegoose";

import { Article } from "./article.model";
import { PublishState, Origin } from "./article.interface";
import { HttpRequestOption, PaginationData } from "@src/interfaces/http.interface";

@Injectable()
export class ArticleService {
    constructor(
        @InjectModel(Article) private articleModel: ModelType<Article>
    ) {}

    //检测文章是否存在
    private async isExist(article: Article): Promise<boolean> {
        let found_article: Article = await this.articleModel.findOne({ title: article.title, user_id: article.user_id }).exec();

        if(found_article) {
            return Promise.resolve(true);
        }
        else {
            return Promise.resolve(false);
        }
    }
    
    //获取文章
    public async get(option: HttpRequestOption): Promise<PaginationData<Article[]>> {
        let page: number = option.page? Number.parseInt(option.page): 1;
        let page_size: number = option.page_size? Number.parseInt(option.page_size): 10;
        let offset: number = (page - 1) * page_size;
        let condition: any = {
            user_id: option.user_id
        };

        if(option.state && option.state !== "0") {
            condition.state = Number.parseInt(option.state);
        }
        if(option.origin && option.origin !== "0") {
            condition.origin = Number.parseInt(option.origin);
        }

        let result: PaginationData<Article[]> = {};
        result.total = await this.articleModel.estimatedDocumentCount().exec();
        result.data = await this.articleModel.find(condition).skip(offset).limit(page_size).populate("categories").populate("tags").exec();

        return Promise.resolve(result);
    }

    public getOne() {

    }

    //创建文章
    public async create(article: Article): Promise<Article> {
        let is_exist: boolean = await this.isExist(article);
        if(is_exist) {
            return Promise.reject("文章已经存在");
        }

        return this.articleModel.create(article).catch( //因数据不符合要求创建失败抛异常
            (reason) => {
                return Promise.reject(reason["message"]);
            }
        );
    }

    //修改文章
    public update(article: Article): Promise<Article> {
        return this.articleModel.updateOne({_id: article._id}, article).exec().catch(   //因数据不符合要求创建失败抛异常
            (reason) => {
                return Promise.reject(reason["message"]); 
            }
        );
    }
}