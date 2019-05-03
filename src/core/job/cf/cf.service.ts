/**
 * @file 基于协同过滤推荐服务
 * @module core/job/cf/service
 */

import { Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ModelType } from "typegoose";
import { Types } from "mongoose";
let recommend = require("../recommend");

import { RECOMMEND } from "@src/app.config";
import { Log } from "@src/modules/log/log.model";
import { Recommend } from "@src/modules/recommend/recommend.model";
import { beforeDay } from "../kit";
import { Subject } from "rxjs";

@Injectable()
export class CollaborativeFilterService {
    private $user_done: Subject<boolean>;
    private user_count: number;

    constructor(
        @InjectModel(Log) private logModel: ModelType<Log>,
        @InjectModel(Recommend) private recommendModel: ModelType<Recommend>
    ) {
        this.$user_done = new Subject<boolean>();
    }

    /**
     * 基于协同过滤推荐文章
     */
    public async recommend(): Promise<void> {
        let frame: Frame<number> = new Frame<number>(0);
        let date: Date = beforeDay(RECOMMEND.valuableDay);
        
        let logs: Log[] = await this.logModel.find({update_at: { $gte: date }}).exec();
        logs.forEach(
            (log: Log) => {
                let value: number = (log.preference_degree * 100 + log.count + log.duration) / 120; //权重函数
                frame.set(log.user_id.toHexString(), log.article_id.toHexString(), this.getScore(value));
            }
        );

        // console.info(frame.value);

        let count: number = 0;
        let rows: IterableIterator<[any, number]> = frame.rows.entries();
        this.user_count = 0;
        this.$user_done.subscribe((value: boolean) => {
            this.user_count++;

            if(this.user_count === frame.rows.size) {
                console.info(`collaborative filter recommend ${count} items for ${frame.rows.size} user, average: ${ Math.floor(count / frame.rows.size)}`);
            }
        });

        for(let row of rows) {
            recommend.getCFRecommendations(frame.value, row[1], {}, async (recoms: { item_id, score }[]) => {
                // console.info(recoms);
                
                for(let recom of recoms) {
                    if(recom.score <= 1) {
                        continue;
                    }

                    let user_id: Types.ObjectId = Types.ObjectId(row[0]);
                    let article_id: Types.ObjectId = Types.ObjectId(frame.columns_reverse.get(recom.item_id));
                    let recommend = { user_id: user_id, article_id: article_id, score: recom.score };

                    let found: Recommend = await this.recommendModel.findOne({ user_id: user_id, article_id: article_id }).exec();
                    if(!found) {
                        await this.recommendModel.create(recommend);
                        count++;
                    }
                }

                this.$user_done.next(true);
            });
        }
    }

    /**
     * 对输入值进行评分，结果范围为0-100
     * @param value 输入值
     */
    private getScore(value: number): number {
        return Math.round((1 - Math.exp(-value)) * 100);
    }
}

export class Frame<T> {
    private _matrix: Array<Array<T>>;
    private _rows: Map<any, number>;
    private _columns: Map<any, number>;
    private _columns_reverse: Map<number, any>;
    private _default_value: T;

    /**
     * @param default_value 值为空时的默认值
     */
    constructor(default_value: T) {
        this._matrix = new Array<Array<T>>();
        this._rows = new Map<any, number>();
        this._columns = new Map<any, number>();
        this._columns_reverse = new Map<number, any>();
        this._default_value = default_value;
    }

    /**
     * 设置单元格的值
     * @param row 指定行
     * @param column 指定列
     * @param value 要设置的值
     */
    public set(row: any, column: any, value: T): void {
        let row_index: number = this._rows.get(row);
        if(row_index === undefined) {
            row_index = this._rows.size;
            this._rows.set(row, row_index);
            this._matrix.push(new Array(this._columns.size));
            for(let i = 0; i < this._matrix[row_index].length; i++) {
                this._matrix[row_index][i] = this._default_value;
            }
        }
        let column_index: number = this._columns.get(column);
        if(column_index === undefined) {
            column_index = this._columns.size;
            this._columns.set(column, column_index);
            this._columns_reverse.set(column_index, column);
            this._matrix.forEach((value: T[]) => value.push(this._default_value));
        }

        this._matrix[row_index][column_index] = value;
    }

    /**
     * 获取单元格的值
     * @param row 指定行
     * @param column 指定列
     */
    public get(row: any, column: any): T {
        let row_index: number = this._rows.get(row);
        let column_index: number = this._columns.get(column);
        if(!row_index || !column_index) {
            return undefined;
        }

        return this._matrix[row_index][column_index];
    }

    /**
     * 获取表格数据
     */
    public get value(): Array<Array<T>> {
        return this._matrix;
    }

    /**
     * 获取行标记名列表
     */
    public get rows(): Map<any, number> {
        return this._rows;
    }

    /**
     * 获取列标记名列表
     */
    public get columns(): Map<any, number> {
        return this._columns;
    }

    public get columns_reverse(): Map<number, any> {
        return this._columns_reverse;
    }
}