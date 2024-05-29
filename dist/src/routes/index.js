"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const todo_1 = __importDefault(require("./todo"));
const rootRouter = (0, express_1.Router)();
rootRouter.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the Todo API'
    });
});
rootRouter.use('/auth', auth_1.default);
rootRouter.use('/todos', todo_1.default);
exports.default = rootRouter;
//# sourceMappingURL=index.js.map