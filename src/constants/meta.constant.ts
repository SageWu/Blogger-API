/**
 * @file 元数据常量键
 * @module constants/meta/constant
 */

import * as constants from "@nestjs/common/constants";

export const HTTP_IS_ERROR: string = "__customHttpIsError__";
export const HTTP_SUCCESS_CODE: string = constants.HTTP_CODE_METADATA;
export const HTTP_SUCCESS_MESSAGE: string = "__customHttpSuccessMessage__";
export const HTTP_ERROR_CODE: string = "__customHttpErrorCode__";
export const HTTP_ERROR_MESSAGE: string = "__customHttpErrorMessage__";
export const HTTP_MESSAGE: string = "__customHttpMessage__";

export const HTTP_RESPONSE_PAGINATE: string = "__customHttpResponsePaginate__";

export const HTTP_CACHE_TTL_META: string = "__customHttpCacheTTL__";