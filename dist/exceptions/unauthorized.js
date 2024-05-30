"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unauthorizedException = void 0;
const _1 = require(".");
class unauthorizedException extends _1.HttpException {
    constructor(message, errorCode) {
        super(message, errorCode, 401, null);
    }
}
exports.unauthorizedException = unauthorizedException;
//# sourceMappingURL=unauthorized.js.map