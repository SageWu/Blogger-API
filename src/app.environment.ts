/**
 * @file 环境
 * @module app/environment
 */

export const environment: string = process.env.NODE_ENV;
export const isDevMode: boolean = environment === "development";
export const isProdMode: boolean = environment === "production";
export const isTestMode: boolean = environment === "test";