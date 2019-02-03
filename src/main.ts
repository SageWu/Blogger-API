/**
 * @file 入口文件
 * @module app/main
 */

import { NestFactory, Reflector } from '@nestjs/core';
import * as bodyParser from "body-parser";

import { APP } from "./app.config"
import { AppModule } from './app.module';
import { isProdMode, isDevMode } from './app.environment';
import { TransformInterceptor } from './interceptors/transform.interceptor';

//修改console显示
const { log, info, warn, error } = console;
const color = c => isDevMode? c: '';
global.console = Object.assign(console, {
	log: (...args) => log("[log]:", ...args),
	info: (...args) => info(color('\x1b[34m%s\x1b[0m'), "[info]:", ...args),
	warn: (...args) => warn(color('\x1b[33m%s\x1b[0m'), "[warn]:", ...args),
	error: (...args) => error(color('\x1b[31m%s\x1b[0m'), "[error]:", ...args)
});

async function bootstrap() {
	const app = await NestFactory.create(AppModule, isProdMode? { logger: false }: null);
	app.use(bodyParser.json());	//解析请求body
	app.useGlobalInterceptors(new TransformInterceptor(new Reflector()));
	await app.listen(APP.port);
}
bootstrap().then(() => {
	console.info(`Listening at ${APP.port}, env: ${APP.environment}`);
});