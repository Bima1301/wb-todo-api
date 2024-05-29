import { ErrorCodes, HttpException } from ".";

export class BadRequestException extends HttpException {
     constructor(message: string, errorCode: ErrorCodes, errors: any) {
          super(message, errorCode, 400, errors || null);
     }
}