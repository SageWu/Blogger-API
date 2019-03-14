/**
 * @file 文章目录服务
 * @module modules/category/service
 */

import { Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ModelType } from "typegoose";

import { HttpRequestOption, PaginationData } from "@src/interfaces/http.interface";
import { Category } from "./category.model";
import { Types } from "mongoose";
import { Article } from "../article/article.model";

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category) private categoryModel: ModelType<Category>,
        @InjectModel(Article) private articleModel: ModelType<Article>
    ) {}

    //检测文章目录是否存在
    private async isExist(category: Category): Promise<boolean> {
        let found_category: Category = await this.categoryModel.findOne({ name: category.name, user_id: category.user_id }).exec();

        if(found_category) {
            return Promise.resolve(true);
        }
        else {
            return Promise.resolve(false);
        }
    }

    //获取文章目录
    public async get(option: HttpRequestOption): Promise<PaginationData<Category[]>> {
        let page: number = option.page? Number.parseInt(option.page): 1;
        let page_size: number = option.page_size? Number.parseInt(option.page_size): 10;
        let offset: number = (page - 1) * page_size;
        let condition: any = {
            user_id: option.user_id
        };

        let result: PaginationData<Category[]> = {};
        result.total = await this.categoryModel.estimatedDocumentCount().exec();
        result.data = await this.categoryModel.find(condition).skip(offset).limit(page_size).exec();

        let counts: { _id, num }[] = await this.articleModel.aggregate([
            { $unwind: "$categories" },
            { $group: { _id: "$categories", num: { $sum: 1 } } }
        ]).exec();

        result.data = JSON.parse(JSON.stringify(result.data));
        result.data.forEach((value: Category) => {
            let found = counts.find((count) => count._id.toString() == value._id.toString());
            value.count = found? found.num: 0
        });

        return Promise.resolve(result);
    }

    //获取所有文章目录
    public getAll(user_id: string): Promise<Category[]> {
        return this.categoryModel.find({ user_id: user_id }).exec();
    }

    //创建文章目录
    public async create(category: Category): Promise<Category> {
        let is_exist: boolean = await this.isExist(category);
        if(is_exist) {
            return Promise.reject("文章目录已经存在");
        }

        return this.categoryModel.create(category).catch( //因数据不符合要求创建失败抛异常
            (reason) => {
                return Promise.reject(reason["message"]);
            }
        );
    }

    //修改文章目录
    public update(category: Category): Promise<Category> {
        return this.categoryModel.updateOne({_id: category._id}, category).exec().catch(    //因数据不符合要求创建失败抛异常
            (reason) => {
                return Promise.reject(reason["message"]); 
            }
        );
    }

    //删除文章目录
    public delete(category_id: Types.ObjectId): Promise<boolean> {
        return this.categoryModel.deleteOne({ _id: category_id }).exec().then(
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

    //批量删除文章目录
    public deleteMany(category_ids: Types.ObjectId[]): Promise<boolean> {
        return this.categoryModel.deleteMany({ _id: { $in: category_ids } }).exec().then(
            (value) => {
                if(value.n === category_ids.length) {
                    return true;
                }
                else {
                    return false;
                }
            }
        );
    }
}