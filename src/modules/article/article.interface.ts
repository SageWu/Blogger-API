/**
 * @file 文章相关接口
 * @module modules/article/interface
 */

//文章发布状态
export enum PublishState {
    All = 0,
    Draft = 1,  //草稿
    Published = 2,  //已发布
    Recycle = 3 //回收站
}

//文章源
export enum Origin {
    All = 0,
    Original = 1,   //原创
    Reprint = 2,    //转载
    Hybrid = 3  //混合
}

//排序
export enum Sort {
    Asc = 0,
    Desc = 1,
    Hot = 2
}