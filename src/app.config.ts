/**
 * @file 应用配置文件
 * @module app/config
 */

import { RequestMethod } from "@nestjs/common";
import * as path from "path";

import { environment } from "./app.environment";

//app配置
export const APP = {
    port: 2222,
    environment: environment
};

//认证模块配置
export const AUTH = {
    jwtTokenSecret: "blogger",
    expiresIn: 3600,
    data: "blogger"
};

//项目信息
const package_json = require(path.join(__dirname, "..") + "/package.json");
export const INFO = {
    name: package_json.name,
    version: package_json.version,
    description: package_json.description,
    author: package_json.author,
    github: "https://github.com/SageWu"
};

//跨域配置
export const CORS = {
    allowedOrigins: ["http://localhost:4200"],
    allowedHeaders: ["Authorization", "Origin", "Content-Type"],
    allowedMethods: [RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.HEAD, RequestMethod.PATCH]
};

export const MONGODB = {
    uri: "mongodb://127.0.0.1:27017/blogger",
    username: "blogger",
    password: "blogger"
};