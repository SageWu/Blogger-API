/**
 * @file 缓存装饰器
 * @module decorators/cache/decorator
 */

import { CacheKey, ReflectMetadata } from "@nestjs/common";

import * as META from "@src/constants/meta.constant"

 interface ICacheOption {
    key: string,
    ttl?: number
}

export function HttpCache(option: ICacheOption): MethodDecorator;
export function HttpCache(key: string, ttl?: number): MethodDecorator;
export function HttpCache(...args): MethodDecorator {
    let option = args[0];
    let isOption = (value): value is ICacheOption => typeof(value) === "object";

    let key: string = isOption(option)? option.key: option;
    let ttl: number = isOption(option)? option.ttl: (args[1] || null);

    return (_, __, descriptor: PropertyDescriptor) => {
        if(key) {
            CacheKey(key)(descriptor.value);
        }
        if(ttl) {
            ReflectMetadata(META.HTTP_CACHE_TTL_META, ttl)(descriptor.value);
        }

        return descriptor;
    }
}