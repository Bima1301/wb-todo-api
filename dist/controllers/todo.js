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
exports.statusTodo = exports.deleteTodo = exports.updateTodo = exports.listTodo = exports.createTodo = void 0;
const index_1 = require("../helper/index");
const __1 = require("..");
const not_found_1 = require("../exceptions/not-found");
const exceptions_1 = require("../exceptions");
const createTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title } = req.body;
    if (!req.user) {
        return res.status(401).json((0, index_1.apiResponse)(401, 'Unauthorized', null));
    }
    const todo = yield __1.prismaClient.todo.create({
        data: {
            title: title,
            completed: false,
            user: {
                connect: {
                    id: req.user.id
                }
            }
        }
    });
    console.log(todo);
    res.status(201).json((0, index_1.apiResponse)(201, 'Todo created successfully', todo));
});
exports.createTodo = createTodo;
const listTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(401).json((0, index_1.apiResponse)(401, 'Unauthorized', null));
    }
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
    // Extract and parse filters
    const filters = req.query.filters ? JSON.parse(req.query.filters) : {};
    const searchFilters = req.query.searchFilters ? JSON.parse(req.query.searchFilters) : {};
    const count = yield __1.prismaClient.todo.count();
    const todos = yield __1.prismaClient.todo.findMany({
        where: Object.assign(Object.assign({ userId: req.user.id }, filters), { AND: Object.keys(searchFilters).map(key => ({
                [key]: {
                    contains: searchFilters[key],
                    mode: 'insensitive'
                }
            })) }),
        skip: (page - 1) * pageSize,
        take: pageSize
    });
    const response = {
        todos,
        page: Math.ceil(count / pageSize),
        pageSize,
    };
    res.status(200).json((0, index_1.apiResponse)(200, 'Todos found', response));
});
exports.listTodo = listTodo;
const updateTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todo = req.body;
        const updatedTodo = yield __1.prismaClient.todo.update({
            where: {
                id: req.params.id
            },
            data: Object.assign({}, todo)
        });
        res.status(200).json((0, index_1.apiResponse)(200, 'Todo updated successfully', updatedTodo));
    }
    catch (error) {
        throw new not_found_1.NotFoundException('Todo not found', exceptions_1.ErrorCodes.TODO_NOT_FOUND);
    }
});
exports.updateTodo = updateTodo;
const deleteTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield __1.prismaClient.todo.delete({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json((0, index_1.apiResponse)(200, 'Todo deleted successfully', null));
    }
    catch (error) {
        throw new not_found_1.NotFoundException('Todo not found', exceptions_1.ErrorCodes.TODO_NOT_FOUND);
    }
});
exports.deleteTodo = deleteTodo;
const statusTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, id } = req.body;
        const todo = yield __1.prismaClient.todo.update({
            where: {
                id
            },
            data: {
                completed: status
            }
        });
        res.status(200).json((0, index_1.apiResponse)(200, 'Todo status updated successfully', todo));
    }
    catch (error) {
        throw new not_found_1.NotFoundException('Todo not found', exceptions_1.ErrorCodes.TODO_NOT_FOUND);
    }
});
exports.statusTodo = statusTodo;
//# sourceMappingURL=todo.js.map