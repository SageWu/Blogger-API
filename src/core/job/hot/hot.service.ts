/**
 * @file 热门文章推荐服务
 * @module core/job/hot/service
 */

import { Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ModelType } from "typegoose";
import { Types } from "mongoose";

import { Log } from "@src/modules/log/log.model";
import { HttpRequestOption, PaginationData } from "@src/interfaces/http.interface";
import { Article } from "@src/modules/article/article.model";
import { RECOMMEND } from "@src/app.config";
import { Hot } from "./hot.model";

@Injectable()
export class HotService {
    public before_day: number;              //热点文章有效时间
    public days: number[];                  //月份天数

    constructor(
        @InjectModel(Log) private logModel: ModelType<Log>,
        @InjectModel(Hot) private hotModel: ModelType<Hot>
    ) {
        this.before_day = RECOMMEND.hotDay;
        this.days = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    }

    //推荐热门文章
    public async recommend(): Promise<void> {
        let logs: Log[];

        let date: Date = new Date();
        let day: number = date.getDate();
        if(day > this.before_day) {
            day -= this.before_day;
            date.setDate(day);
        }
        else {  //不够减
            day = this.before_day - day;    //还需减多少天
            let month: number = date.getMonth() - 1;
            let year: number = date.getFullYear();
            if(month < 0) {
                month = 12;
                year -= 1;
            }
            
            if(month === 1) {   //二月则需判断是否闰年
                if((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)
                    day = this.days[month] - day;
                else
                    day = this.days[month] - 1 - day;
            }
            else {
                day = this.days[month] - day;
            }
        }

        logs = await this.logModel.aggregate([
            { $match: { update_at: { $gte: date } } },
            { $group: { _id: "$article_id", count: { $sum: "$count" }, duration: { $sum: "$duration" }, degree: { $sum: "$preference_degree" } } }
        ])
        .sort({
            degree: -1,
            count: -1,
            duration: -1
        })
        .exec();

        logs.forEach(
            async (log: Log) => {
                let result: any = await this.hotModel.updateOne({ article_id: Types.ObjectId(log._id) }, { update_at: Date.now() }).exec();
                if(result.n === 0) {
                    this.hotModel.create({ article_id: Types.ObjectId(log._id) });
                }
            }
        );

        console.info("hot recommend " + logs.length + " items");
    }

    //判断是否为热门文章
    public async isExist(article_id: Types.ObjectId): Promise<boolean> {
        let hot: Hot = await this.hotModel.findOne({ article_id: article_id }).exec();

        if(hot) {
            return Promise.resolve(true);
        }
        else {
            return Promise.resolve(false);
        }
    }

    //获取热门文章
    public async get(option: HttpRequestOption): Promise<PaginationData<Article[]>> {
        let page: number = option.page? Number.parseInt(option.page): 1;
        let page_size: number = option.page_size? Number.parseInt(option.page_size): 10;
        let offset: number = (page - 1) * page_size;

        let result: PaginationData<any[]> = {};
        result.total = await this.hotModel.estimatedDocumentCount().exec();
        let hots: Hot[] = await this.hotModel.find()
            .skip(offset)
            .limit(page_size)
            .sort({ update_at: -1 })
            .populate("article_id")
            .exec();
        result.data = hots.map((hot: Hot) => hot.article_id);
        
        return Promise.resolve(result);
    }
}