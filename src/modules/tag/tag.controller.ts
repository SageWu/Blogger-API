import { Controller, Get, Post } from "@nestjs/common";

@Controller("tag")
export class TagController {
    constructor() {}

    @Post()
    public getTags() {

    }
}