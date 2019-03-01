/**
 * @file 主模块
 * @module app/module
 */

import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { DatabaseModule } from './core/database/database.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { HelperModule } from './core/helper/helper.module';
import { AppController } from './app.controller';
import { CorsMiddleware } from './middlewares/cors.middleware';
import { ArticleModule } from './modules/article/article.module';
import { TagModule } from './modules/tag/tag.module';
import { CategoryModule } from './modules/category/category.module';

@Module({
	imports: [
		DatabaseModule,
		HelperModule,
		AuthModule,
		UserModule,
		TagModule,
		CategoryModule,
		// ArticleModule
	],
	controllers: [
		AppController
	],
	providers: [
	]
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(CorsMiddleware).forRoutes("*");
	}
}
