import { ErrorCodes, HttpException } from ".";

export class unauthorizedException extends HttpException {
     constructor(message: string, errorCode: ErrorCodes) {
          super(message, errorCode, 401, null);
     }
}