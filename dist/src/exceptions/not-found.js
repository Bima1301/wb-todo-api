"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundException = void 0;
const _1 = require(".");
class NotFoundException extends _1.HttpException {
    constructor(message, errorCode) {
        super(message, errorCode, 400, null);
    }
}
exports.NotFoundException = NotFoundException;
//# sourceMappingURL=not-found.js.map