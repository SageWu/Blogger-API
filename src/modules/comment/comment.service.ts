/**
 * @file 文章评论服务
 * @module modules/comment/service
 */

import { Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ModelType } from "typegoose";

import { HttpRequestOption, PaginationData } from "@src/interfaces/http.interface";
import { CommentState } from "./comment.interface";
import { Comment } from "./comment.model";
import { Sort } from "../article/article.interface";
import { Types } from "mongoose";
import { Article } from "../article/article.model";

@Injectable()
export class CommentService {
    constructor(
        @InjectModel(Comment) private commentModel: ModelType<Comment>,
        @InjectModel(Article) private articleModel: ModelType<Article>
    ) {}

    //获取评论列表
    public async get(option: HttpRequestOption): Promise<PaginationData<Comment[]>> {
        let page: number = option.page? Number.parseInt(option.page): 1;
        let page_size: number = option.page_size? Number.parseInt(option.page_size): 10;
        let offset: number = (page - 1) * page_size;
        let condition: any = {};
        let sort: any = {};

        if(option.user_id) {
            condition.author_id = option.user_id;
        }
        if(option.article_id) {
            condition.article_id = option.article_id;
        }
        if(option.state && option.state !== CommentState.All.toString()) {
            condition.state = Number.parseInt(option.state);
        }
        if(option.keyword !== "") {
            condition.content = RegExp(option.keyword);
        }

        if(option.sort === Sort.Asc.toString()) {
            sort.create_at = 1;
        }
        else if(option.sort === Sort.Desc.toString()) {
            sort.create_at = -1;
        }

        let result: PaginationData<Comment[]> = {};
        result.total = await this.commentModel.countDocuments(condition).exec();
        result.data = await this.commentModel.find(condition)
            .skip(offset)
            .limit(page_size)
            .populate("user_id", "name")
            .sort(sort).exec();

        return Promise.resolve(result);
    }

    //创建评论
    public async create(comment: Comment): Promise<Comment> {
        return this.commentModel.create(comment)
        .then(
            async (value) => {
                await this.articleModel.updateOne({ _id: comment.article_id }, { $inc: { comments_num: 1 } }).exec();

                return value;
            }
        )
        .catch( //因数据不符合要求创建失败抛异常
            (reason) => {
                return Promise.reject(reason["message"]);
            }
        );
    }

    //修改评论
    public update(comment: Comment): Promise<Comment> {
        return this.commentModel.updateOne({_id: comment._id, author_id: comment.author_id}, comment).exec().catch(   //因数据不符合要求创建失败抛异常
            (reason) => {
                return Promise.reject(reason["message"]); 
            }
        );
    }

    //批量修改评论
    public updateMany(comments: Comment[]): Promise<boolean> {
        let ids: Types.ObjectId[] = comments.map((comment: Comment) => comment._id);
        let author_id: Types.ObjectId = comments[0].author_id;
        let state: CommentState = comments[0].state;

        return this.commentModel.updateMany({ _id: { $in: ids }, author_id: author_id }, { state: state }).exec().then(
            (value) => {
                if(value.n === comments.length) {
                    return true;
                }
                else {
                    return false;
                }
            }
        );
    }
}