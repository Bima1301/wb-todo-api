"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const index_1 = require("../helper/index");
const errorMiddleware = (error, req, res, next) => {
    const response = (0, index_1.apiResponse)(error.errorCode, error.message, error.errors || null);
    return res.status(error.statusCode).json(response);
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=errors.js.map