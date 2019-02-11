/**
 * @file 用户实体
 * @module modules/user/entity
 */

import { Typegoose, prop } from "typegoose";

export class User extends Typegoose {
    @prop({
        required: true,
        unique: true
    })
    account: string;    //帐号
    
    @prop({
        required: true
    })
    password: string;   //密码

    @prop({
        required: true,
        unique: true
    })
    name: string;   //名称

    @prop({
        unique: true
    })
    email?: string;  //邮箱

    @prop()
    slogan?: string; //标语

    @prop()
    avatar?: string; //头像

    @prop({
        default: Date.now
    })
    create_at?: Date;    //创建时间

    @prop({
        default: Date.now
    })
    update_at?: Date;    //更新时间
}