/**
 * @file 数据库模块
 * @module core/database/module
 */

import { Module, Global } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Connection } from "typeorm";

@Global()
@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "mongodb",
            host: "localhost",
            port: 27017,
            username: "blogger",
            password: "blogger",
            database: "blogger",
            entities: ["src/modules/**/**.entity{.ts,.js}"],
            synchronize: true,
            useNewUrlParser: true
        })
    ]
})
export class DatabaseModule {
    constructor(
        private con: Connection
    ) {
        if(this.con.isConnected) {
            console.info("Connect to database successfully");
        }
    }
}