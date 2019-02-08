/**
 * @file 文章实体
 * @module modules/article/entity
 */

 import { Entity, ObjectIdColumn, ObjectID, Column, ManyToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { PublishState, Origin } from "./article.interface";
import { Category } from "../category/category.entity";
import { Tag } from "../tag/tag.entity";

@Entity()
export class Article {
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    title: string;  //标题

    @Column()
    content: string;    //内容

    @Column({
        nullable: true
    })
    thumb: string;  //缩略图

    @Column()
    state: PublishState;    //发布状态

    @Column()
    origin: Origin  //文章源

    @Column({
        default: 0
    })
    views: number;   //阅读数量

    @Column({
        default: 0
    })
    likes: number;   //喜欢数量

    @Column({
        default: 0
    })
    comments: number;   //评论数量

    @CreateDateColumn()
    create_at: Date;    //创建时间

    @UpdateDateColumn()
    update_at: Date;    //更新时间

    @Column()
    categories: string[]; //文章所属类别

    @Column()
    tags: string[];    //文章标签
}