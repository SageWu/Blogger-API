/**
 * @file 浏览记录服务
 * @module modules/log/service
 */

import { Injectable } from "@nestjs/common";
import { Log } from "./log.model";
import { InjectModel } from "nestjs-typegoose";
import { ModelType } from "typegoose";
import { Types } from "mongoose";

@Injectable()
export class LogService {
    constructor(
        @InjectModel(Log) private logModel: ModelType<Log>
    ) {}

    //检测是否存在
    public async isExist(log: Log): Promise<boolean> {
        let found_log: Log = await this.logModel.findOne({ user_id: log.user_id, article_id: log.article_id }).exec();

        if(found_log) {
            return Promise.resolve(true);
        }
        else {
            return Promise.resolve(false);
        }
    }

    //获取记录
    public getOne(user_id: Types.ObjectId, article_id: Types.ObjectId): Promise<Log> {
        return this.logModel.findOne({ user_id: user_id, article_id: article_id }).exec();
    }

    //创建记录
    public async create(log: Log): Promise<Log> {
        let is_exist: boolean = await this.isExist(log);
        if(is_exist) {
            return Promise.reject("记录已存在");
        }
        
        return this.logModel.create(log).catch( //因数据不符合条件抛异常
            (reason) => {
                return Promise.reject(reason["message"]); 
            }
        );
    }

    //更新记录
    public async update(log: Log): Promise<Log> {
        let is_exist: boolean = await this.isExist(log);

        if(is_exist) {
            let count: number = log.count? log.count: 0;
            let duration: number = log.duration? log.duration: 0;
            let doc: any = {
                $inc: {
                    count: count,
                    duration: duration
                },
                update_at: new Date()
            };
            if(log.preference_degree) {
                doc.preference_degree = log.preference_degree;
            }
            
            return this.logModel.updateOne({user_id: log.user_id, article_id: log.article_id}, doc).exec().catch(   //数据不符合要求
                (reason: any) => {
                    return Promise.reject(reason["message"]); 
                }
            );
        }
        else {
            return this.create(log);
        }
    }
}