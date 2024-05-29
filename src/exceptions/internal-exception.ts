import { ErrorCodes, HttpException } from ".";

export class InternalException extends HttpException {
     constructor(message: string, errors: any, errorCode: ErrorCodes) {
          super(message, errorCode, 500, errors);
     }
}