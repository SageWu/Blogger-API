/**
 * @file 文章标签服务
 * @module modules/tag/service
 */

import { Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ModelType } from "typegoose";
import { Types } from "mongoose";

import { Tag } from "./tag.model";
import { HttpRequestOption, PaginationData } from "@src/interfaces/http.interface";

@Injectable()
export class TagService {
    constructor(
        @InjectModel(Tag) private tagModel: ModelType<Tag>
    ) {}

    //检测标签是否已经存在
    private async isExist(tag: Tag): Promise<boolean> {
        let found_tag: Tag = await this.tagModel.findOne({ name: tag.name, user_id: tag.user_id }).exec();

        if(found_tag) {
            return Promise.resolve(true);
        }
        else {
            return Promise.resolve(false);
        }
    }

    //获取标签
    public async get(option: HttpRequestOption): Promise<PaginationData<Tag[]>> {
        let page: number = Number.parseInt(option.page);
        let page_size: number = Number.parseInt(option.page_size);
        let offset: number = (page - 1) * page_size;
        let condition: any = {
            user_id: option.user_id
        };

        if(option.keyword && option.keyword !== "") {
            condition.name = RegExp(option.keyword);
        }

        let result: PaginationData<Tag[]> = {};
        result.total = await this.tagModel.estimatedDocumentCount().exec();
        result.data = await this.tagModel.find(condition).skip(offset).limit(page_size).exec();

        return Promise.resolve(result);
    }

    //创建标签
    public async create(tag: Tag): Promise<Tag> {
        let is_exist: boolean = await this.isExist(tag);        
        if(is_exist) {
            return Promise.reject("标签已存在");
        }

        return this.tagModel.create(tag).catch( //因数据不符合要求创建失败抛异常
            (reason) => {
                return Promise.reject(reason["message"]);
            }
        );
    }

    //修改标签
    public update(tag: Tag): Promise<Tag> {
        return this.tagModel.updateOne({_id: tag["_id"]}, tag).exec().catch(
            (reason) => {
                return Promise.reject(reason["message"]); 
            }
        );
    }

    //删除标签
    public delete(tag_id: Types.ObjectId): Promise<boolean> {
        return this.tagModel.deleteOne({ _id: tag_id }).exec().then(
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

    public deleteMany(tag_ids: Types.ObjectId[]): Promise<boolean> {
        return this.tagModel.deleteMany({ _id: { $in: tag_ids } }).exec().then(
            (value) => {
                if(value.n === tag_ids.length) {
                    return true;
                }
                else {
                    return false;
                }
            }
        )
    }
}