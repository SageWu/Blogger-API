/**
 * @file 个性推荐文章服务
 * @module modules/recommend/service
 */

import { Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ModelType } from "typegoose";

import { HttpRequestOption, PaginationData } from "@src/interfaces/http.interface";
import { Recommend } from "./recommend.model";
import { Article } from "../article/article.model";

@Injectable()
export class RecommendService {
    constructor(
        @InjectModel(Recommend) private recommendModel: ModelType<Recommend>
    ) {}

    public async get(option: HttpRequestOption): Promise<PaginationData<Article[]>> {
        let page: number = option.page? Number.parseInt(option.page): 1;
        let page_size: number = option.page_size? Number.parseInt(option.page_size): 10;
        let offset: number = (page - 1) * page_size;

        let result: PaginationData<any[]> = {};
        result.total = await this.recommendModel.countDocuments({ user_id: option.user_id }).exec();
        let recoms: Recommend[] = await this.recommendModel.find({ user_id: option.user_id })
            .skip(offset)
            .limit(page_size)
            .sort({ 
                create_at: -1,
                score: -1
            })
            .populate("article_id")
            .exec();
        result.data = recoms.map((recom: Recommend) => recom.article_id);
        
        return Promise.resolve(result);
    }
}