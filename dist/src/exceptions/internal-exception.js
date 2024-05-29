"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalException = void 0;
const _1 = require(".");
class InternalException extends _1.HttpException {
    constructor(message, errors, errorCode) {
        super(message, errorCode, 500, errors);
    }
}
exports.InternalException = InternalException;
//# sourceMappingURL=internal-exception.js.map