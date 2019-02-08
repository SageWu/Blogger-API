/**
 * @file 文章相关接口
 * @module modules/article/interface
 */

//文章发布状态
export enum PublishState {
    Draft = 1,  //草稿
    Published = 2,  //已发布
    Recycle = 3 //回收站
}

//文章源
export enum Origin {
    Original = 1,   //原创
    Reprint = 2,    //转载
    Hybrid = 3  //混合
}