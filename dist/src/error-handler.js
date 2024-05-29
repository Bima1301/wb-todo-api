"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const index_1 = require("./../helper/index");
const exceptions_1 = require("./exceptions");
const internal_exception_1 = require("./exceptions/internal-exception");
const zod_1 = require("zod");
const bad_request_1 = require("./exceptions/bad-request");
const ErrorHandler = (method) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield method(req, res, next);
        }
        catch (error) {
            let exception;
            if (error instanceof exceptions_1.HttpException) {
                exception = error;
            }
            else {
                if (error instanceof zod_1.ZodError) {
                    const formatZodErrorString = (0, index_1.formatZodError)(error);
                    exception = new bad_request_1.BadRequestException('Unprocessable entity', exceptions_1.ErrorCodes.UNPROSSESABLE_ENTITY, formatZodErrorString);
                }
                else {
                    exception = new internal_exception_1.InternalException('Internal server error', error, exceptions_1.ErrorCodes.INTERNAL_EXCEPTION);
                }
            }
            next(exception);
        }
    });
};
exports.ErrorHandler = ErrorHandler;
//# sourceMappingURL=error-handler.js.map