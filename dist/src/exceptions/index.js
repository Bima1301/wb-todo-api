"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCodes = exports.HttpException = void 0;
class HttpException extends Error {
    constructor(message, errorCode, statusCode, errors) {
        super(message);
        this.message = message;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.errors = errors;
    }
}
exports.HttpException = HttpException;
var ErrorCodes;
(function (ErrorCodes) {
    ErrorCodes[ErrorCodes["USER_NOT_FOUND"] = 1001] = "USER_NOT_FOUND";
    ErrorCodes[ErrorCodes["USER_ALREADY_EXISTS"] = 1002] = "USER_ALREADY_EXISTS";
    ErrorCodes[ErrorCodes["INCORRECT_PASSWORD"] = 1003] = "INCORRECT_PASSWORD";
    ErrorCodes[ErrorCodes["UNPROSSESABLE_ENTITY"] = 2001] = "UNPROSSESABLE_ENTITY";
    ErrorCodes[ErrorCodes["INTERNAL_EXCEPTION"] = 3001] = "INTERNAL_EXCEPTION";
    ErrorCodes[ErrorCodes["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    ErrorCodes[ErrorCodes["TODO_NOT_FOUND"] = 4001] = "TODO_NOT_FOUND";
})(ErrorCodes || (exports.ErrorCodes = ErrorCodes = {}));
//# sourceMappingURL=index.js.map