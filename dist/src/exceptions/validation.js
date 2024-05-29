"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnprossableEntity = void 0;
const _1 = require(".");
class UnprossableEntity extends _1.HttpException {
    constructor(error, message, errorCode) {
        super(message, errorCode, 422, error);
    }
}
exports.UnprossableEntity = UnprossableEntity;
//# sourceMappingURL=validation.js.map