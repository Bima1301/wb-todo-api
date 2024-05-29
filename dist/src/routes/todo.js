"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const todo_1 = require("../controllers/todo");
const auth_1 = __importDefault(require("../middlewares/auth"));
const error_handler_1 = require("./../error-handler");
const express_1 = require("express");
const todoRoutes = (0, express_1.Router)();
todoRoutes.post("/", [auth_1.default], (0, error_handler_1.ErrorHandler)(todo_1.createTodo));
todoRoutes.get("/", [auth_1.default], (0, error_handler_1.ErrorHandler)(todo_1.listTodo));
todoRoutes.put("/:id", [auth_1.default], (0, error_handler_1.ErrorHandler)(todo_1.updateTodo));
todoRoutes.delete("/:id", [auth_1.default], (0, error_handler_1.ErrorHandler)(todo_1.deleteTodo));
todoRoutes.patch("/status", [auth_1.default], (0, error_handler_1.ErrorHandler)(todo_1.statusTodo));
exports.default = todoRoutes;
//# sourceMappingURL=todo.js.map