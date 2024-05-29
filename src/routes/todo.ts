import { createTodo, deleteTodo, listTodo, statusTodo, updateTodo } from '../controllers/todo';
import authMiddleware from '../middlewares/auth';
import { ErrorHandler } from './../error-handler';
import { Router } from "express";

const todoRoutes: Router = Router();
todoRoutes.post("/", [authMiddleware], ErrorHandler(createTodo));
todoRoutes.get("/", [authMiddleware], ErrorHandler(listTodo));
todoRoutes.put("/:id", [authMiddleware], ErrorHandler(updateTodo));
todoRoutes.delete("/:id", [authMiddleware], ErrorHandler(deleteTodo));
todoRoutes.patch("/status", [authMiddleware], ErrorHandler(statusTodo));

export default todoRoutes;