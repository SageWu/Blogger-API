/**
 * @file 主模块
 * @module app/module
 */

import { Module } from '@nestjs/common';

import { AppController } from './app.controller';

import { DatabaseModule } from './core/database/database.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { HelperModule } from './core/helper/helper.module';

@Module({
	imports: [
		DatabaseModule,
		HelperModule,
		AuthModule,
		UserModule,
	],
	controllers: [
		AppController
	],
	providers: [
	]
})
export class AppModule {}
