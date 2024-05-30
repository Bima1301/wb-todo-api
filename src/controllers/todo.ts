import { apiResponse } from '../helper/index';
import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from '../exceptions/not-found';
import { ErrorCodes } from '../exceptions';

export const createTodo = async (req: Request, res: Response) => {
     const { title } = req.body;

     if (!req.user) {
          return res.status(401).json(apiResponse(401, 'Unauthorized', null))
     }

     const todo = await prismaClient.todo.create({
          data: {
               title: title,
               completed: false,
               user: {
                    connect: {
                         id: req.user.id
                    }
               }
          }
     })

     console.log(todo);
     res.status(201).json(apiResponse(201, 'Todo created successfully', todo))
}

export const listTodo = async (req: Request, res: Response) => {
     if (!req.user) {
          return res.status(401).json(apiResponse(401, 'Unauthorized', null))
     }
     const page = req.query.page ? parseInt(req.query.page as string) : 1
     const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 10

     // Extract and parse filters
     const filters = req.query.filters ? JSON.parse(req.query.filters as string) : {};
     const searchFilters = req.query.searchFilters ? JSON.parse(req.query.searchFilters as string) : {};

     const count = await prismaClient.todo.count()
     const todos = await prismaClient.todo.findMany({
          where: {
               userId: req.user.id,
               ...filters,
               AND: Object.keys(searchFilters).map(key => ({
                    [key]: {
                         contains: searchFilters[key],
                         mode: 'insensitive'
                    }
               }))
          },
          skip: (page - 1) * pageSize,
          take: pageSize
     })

     const response = {
          todos,
          page: Math.ceil(count / pageSize),
          pageSize,
     }

     res.status(200).json(apiResponse(200, 'Todos found', response))
}

export const updateTodo = async (req: Request, res: Response) => {
     try {
          const todo = req.body;

          const updatedTodo = await prismaClient.todo.update({
               where: {
                    id: req.params.id
               },
               data: {
                    ...todo
               }
          })

          res.status(200).json(apiResponse(200, 'Todo updated successfully', updatedTodo))

     } catch (error) {
          throw new NotFoundException('Todo not found', ErrorCodes.TODO_NOT_FOUND)
     }
}

export const deleteTodo = async (req: Request, res: Response) => {
     try {
          await prismaClient.todo.delete({
               where: {
                    id: req.params.id
               }
          })

          res.status(200).json(apiResponse(200, 'Todo deleted successfully', null))
     } catch (error) {
          throw new NotFoundException('Todo not found', ErrorCodes.TODO_NOT_FOUND)
     }
}

export const statusTodo = async (req: Request, res: Response) => {
     try {
          const { status, id } = req.body
          const todo = await prismaClient.todo.update({
               where: {
                    id
               },
               data: {
                    completed: status
               }
          })

          res.status(200).json(apiResponse(200, 'Todo status updated successfully', todo))
     } catch (error) {
          throw new NotFoundException('Todo not found', ErrorCodes.TODO_NOT_FOUND)
     }
}