/**
 * @file 文章标签服务
 * @module modules/tag/service
 */

import { Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ModelType } from "typegoose";

import { Tag } from "./tag.model";

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
    public get(option): Promise<Tag[]> {
        let offset: number = (option.page - 1) * option.page_size;

        return this.tagModel.find({ user_id: option.user_id }).skip(offset).limit(option.page_size).exec();
    }

    //创建标签
    public async create(tag: Tag): Promise<Tag> {
        let is_exist: boolean = await this.isExist(tag);        
        if(is_exist) {
            return Promise.reject("标签已存在");
        }

        return this.tagModel.create(tag).catch(
            (reason) => {
                return Promise.reject(reason["message"]);
            }
        );
    }
}