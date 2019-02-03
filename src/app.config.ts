/**
 * @file 应用配置文件
 * @module app/config
 */

import * as path from "path";
import { environment } from "./app.environment";

export const APP = {
    port: 2222,
    environment: environment
}

export const AUTH = {
    jwtTokenSecret: "blogger",
    expiresIn: 3600,
    data: "blogger"
}

const package_json = require(path.join(__dirname, "..") + "/package.json");
export const INFO = {
    name: package_json.name,
    version: package_json.version,
    description: package_json.description,
    author: package_json.author,
    github: "https://github.com/SageWu"
}