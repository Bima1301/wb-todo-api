import { apiResponse } from '../helper/index';
import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions";

export const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
     const response = apiResponse(error.errorCode, error.message, error.errors || null);
     return res.status(error.statusCode).json(response);
}