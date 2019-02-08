/**
 * @file 用户实体
 * @module modules/user/entity
 */

import { Entity, ObjectIdColumn, ObjectID, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @ObjectIdColumn()
    id: ObjectID;

    @Column({
        unique: true
    })
    account: string;    //帐号

    @Column({
        select: false
    })
    password: string;   //密码

    @Column({
        unique: true
    })
    name: string;   //名称

    @Column({
        nullable: true,
        unique: true
    })
    email: string;  //邮箱

    @Column({
        nullable: true
    })
    slogan: string; //标语

    @Column({
        nullable: true
    })
    avatar: string; //头像

    @CreateDateColumn()
    create_at: Date;    //创建时间

    @UpdateDateColumn()
    update_at: Date;    //更新时间
}