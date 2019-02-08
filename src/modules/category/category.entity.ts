/**
 * @file 文章类别实体
 * @module modules/category/entity
 */

import { Entity, ObjectIdColumn, ObjectID, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Category {
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    name: string;   //名称

    @Column()
    description: string;   //描述

    @Column()
    parent: string;  //父类别

    @CreateDateColumn()
    create_at: Date;    //创建时间

    @UpdateDateColumn()
    update_at: Date;    //更新时间

    @Column()
    user_id: string;
}