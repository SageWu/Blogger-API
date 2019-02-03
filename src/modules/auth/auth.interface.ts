/**
 * @file 认证授权相关接口
 * @module modules/auth/interface
 */


export interface AuthBody {
    account: string;
    password: string;
}

export interface AuthQuery {
    ip: string
}

export interface Token {
    access_token?: string;
    expires_in?: number;
}