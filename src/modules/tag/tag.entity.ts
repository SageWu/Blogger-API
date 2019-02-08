/**
 * 
 */

import { Entity, ObjectIdColumn, ObjectID, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Tag {
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    name: string;   //名称

    @Column()
    description: string;    //描述

    @CreateDateColumn()
    create_at: Date;    //创建时间

    @UpdateDateColumn()
    update_at: Date;    //修改时间

    @Column()
    user_id: string;
}