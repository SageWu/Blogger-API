/**
 * @file 用户实体
 * @module modules/user/entity
 */

import { Typegoose, prop, arrayProp } from "typegoose";
import { Types } from "mongoose";

export class User extends Typegoose {
    _id?: Types.ObjectId;

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

    @prop()
    email?: string;  //邮箱

    @prop()
    slogan?: string; //标语

    @prop()
    avatar?: string; //头像

    @arrayProp({
        default: [],
        items: String
    })
    preferences?: string[];  //喜好关键字列表

    @prop()
    last_login?: Date;  //上次登录时间

    @prop({
        default: Date.now
    })
    create_at?: Date;    //创建时间

    @prop({
        default: Date.now
    })
    update_at?: Date;    //更新时间
}