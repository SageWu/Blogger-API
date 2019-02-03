/**
 * @file http响应装饰器
 * @module decorators/http/decorator
 */

import { HttpStatus, ReflectMetadata } from "@nestjs/common";

import * as META from "@src/constants/meta.constant"

interface DecoratorOption {
    successCode?: HttpStatus,
    successMessage?: string,
    errorCode?: HttpStatus,
    errorMessage?: string
}

//构建装饰器
const buildDecorator = (option: DecoratorOption): MethodDecorator => {
    const { successCode, successMessage, errorCode, errorMessage } = option;
    return (_, __, descriptor: PropertyDescriptor) => {
        if(successCode) {
            ReflectMetadata(META.HTTP_SUCCESS_CODE, successCode)(descriptor.value);
        }
        if(successMessage) {
            ReflectMetadata(META.HTTP_SUCCESS_MESSAGE, successMessage)(descriptor.value);
        }
        if(errorCode) {
            ReflectMetadata(META.HTTP_ERROR_CODE, errorCode)(descriptor.value);
        }
        if(errorMessage) {
            ReflectMetadata(META.HTTP_ERROR_MESSAGE, errorMessage)(descriptor.value);
        }

        return descriptor;
    }
}

//失败响应装饰器
export function Error(code: HttpStatus, messag: string): MethodDecorator {
    return buildDecorator({ errorCode: code, errorMessage: messag });
}

//成功响应装饰器
export function Success(code: HttpStatus, messag: string): MethodDecorator {
    return buildDecorator({ successCode: code, successMessage: messag });
}

export const HTTP = { Success, Error };