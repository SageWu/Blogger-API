import { Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ModelType } from "typegoose";

import { Article } from "./article.model";
import { HttpRequestOption, PaginationData } from "@src/interfaces/http.interface";
import { Types } from "mongoose";

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
        let sort: any = {};

        if(option.state && option.state !== "0") {      //文章状态
            condition.state = Number.parseInt(option.state);
        }
        if(option.origin && option.origin !== "0") {    //文章来源
            condition.origin = Number.parseInt(option.origin);
        }
        if(option.category !== "all") {                 //文章目录
            condition.categories = option.category;
        }
        if(option.tag !== "all") {                      //文章标签
            condition.tags = option.tag;
        }
        if(option.keyword !== "") {                     //搜索关键字
            condition.title = RegExp(option.keyword);
            condition.content = RegExp(option.keyword);
        }

        if(option.sort === "0") {                       //排序
            sort.create_at = 1;
        }
        else if(option.sort === "1") {
            sort.create_at = -1;
        }
        else {
            sort.views = -1;
        }

        let result: PaginationData<Article[]> = {};
        if(option.state && option.state !== "0")
            result.total = await this.articleModel.countDocuments({ state: Number.parseInt(option.state) }).exec();
        else
            result.total = await this.articleModel.estimatedDocumentCount().exec();
        result.data = await this.articleModel.find(condition)
            .skip(offset)
            .limit(page_size)
            .populate("categories")
            .populate("tags")
            .sort(sort).exec();

        return Promise.resolve(result);
    }

    public getOne(article_id: string): Promise<Article> {
        return this.articleModel.findOne({ _id: article_id })
            .populate("categories")
            .populate("tags")
            .populate("user_id", "name")
            .exec();
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

    //批量修改文章
    public updateMany(articles: Article[]): Promise<boolean> {
        let ids: Types.ObjectId[] = articles.map((article: Article) => article._id);

        return this.articleModel.updateMany({ _id: { $in: ids } }, { state: articles[0].state }).exec().then(
            (value) => {
                if(value.n === articles.length) {
                    return true;
                }
                else {
                    return false;
                }
            }
        );
    }

    //删除文章
    public delete(article_id: Types.ObjectId): Promise<boolean> {
        return this.articleModel.deleteOne({ _id: article_id }).exec().then(
            (value) => {
                if(value.n === 1) {
                    return true;
                }
                else {
                    return false;
                }
            }
        );
    }

    //批量删除文章
    public deleteMany(article_ids: Types.ObjectId[]): Promise<boolean> {
        return this.articleModel.deleteMany({ _id: { $in: article_ids } }).exec().then(
            (value) => {
                if(value.n === article_ids.length) {
                    return true;
                }
                else {
                    return false;
                }
            }
        );
    }
}