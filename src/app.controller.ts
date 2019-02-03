/**
 * @file 主控制器
 * @module app/controller
 */

import { Controller, Get } from '@nestjs/common';

import * as CACHE_KEY from "@src/constants/cache.constant";
import { INFO } from "@src/app.config";
import { HttpCache } from "@src/decorators/cache.decorator";

@Controller()
export class AppController {
	@Get()
	@HttpCache(CACHE_KEY.INFO, 60 * 60)
	root(): any {
		return INFO;
	}
}
