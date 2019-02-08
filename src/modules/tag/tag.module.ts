import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tag } from "./tag.entity";
import { TagController } from "./tag.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([Tag])
    ],
    controllers: [
        TagController
    ]
})
export class TagModule {}