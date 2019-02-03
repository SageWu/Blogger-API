/**
 * @file 用户实体
 * @module modules/user/entity
 */

import { Entity, ObjectIdColumn, ObjectID, Column } from "typeorm";

@Entity()
export class User {
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    account: string;

    @Column({
        select: false
    })
    password: string;

    @Column()
    name: string;

    @Column({
        nullable: true
    })
    email: string;
}