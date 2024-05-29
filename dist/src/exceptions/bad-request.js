"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestException = void 0;
const _1 = require(".");
class BadRequestException extends _1.HttpException {
    constructor(message, errorCode, errors) {
        super(message, errorCode, 400, errors || null);
    }
}
exports.BadRequestException = BadRequestException;
//# sourceMappingURL=bad-request.js.map