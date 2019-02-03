/**
 * @file Helper模块
 * @module core/helper/module
 */

import { Module, Global, HttpModule } from "@nestjs/common";

import { IpService } from "./ip.service";

@Global()
@Module({
    imports: [
        HttpModule
    ],
    providers: [
        IpService
    ],
    exports: [
        IpService
    ]
})
export class HelperModule {}