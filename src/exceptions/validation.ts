import { ErrorCodes, HttpException } from ".";

export class UnprossableEntity extends HttpException {
     constructor(error: any, message: string, errorCode: ErrorCodes) {
          super(message, errorCode, 422, error);
     }
}