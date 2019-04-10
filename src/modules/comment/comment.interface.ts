/**
 * @file 文章评论实体相关接口
 * @module modules/comment/interface
 */

//文章评论状态
export enum CommentState {
    All = 0,        //所有
    Published = 1,  //显示
    Spam = 2,       //垃圾
    Deleted = 3     //删除
}