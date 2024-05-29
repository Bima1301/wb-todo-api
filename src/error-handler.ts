import { formatZodError } from './../helper/index';
import { NextFunction, Request, Response } from "express"
import { ErrorCodes, HttpException } from "./exceptions"
import { InternalException } from "./exceptions/internal-exception"
import { ZodError } from "zod"
import { BadRequestException } from "./exceptions/bad-request"

export const ErrorHandler = (method: Function) => {
     return async (req: Request, res: Response, next: NextFunction) => {
          try {
               await method(req, res, next)
          } catch (error: any) {
               let exception: HttpException;
               if (error instanceof HttpException) {
                    exception = error;
               } else {
                    if (error instanceof ZodError) {
                         const formatZodErrorString = formatZodError(error)
                         exception = new BadRequestException('Unprocessable entity', ErrorCodes.UNPROSSESABLE_ENTITY, formatZodErrorString)
                    } else {
                         exception = new InternalException('Internal server error', error, ErrorCodes.INTERNAL_EXCEPTION)
                    }
               }
               next(exception)
          }
     }
}
