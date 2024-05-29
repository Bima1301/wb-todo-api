export class HttpException extends Error {
     message: string;
     errorCode: number;
     statusCode: number;
     errors: ErrorCodes;

     constructor(message: string, errorCode: ErrorCodes, statusCode: number, errors: any) {
          super(message);
          this.message = message;
          this.errorCode = errorCode;
          this.statusCode = statusCode;
          this.errors = errors;
     }
}

export enum ErrorCodes {
     USER_NOT_FOUND = 1001,
     USER_ALREADY_EXISTS = 1002,
     INCORRECT_PASSWORD = 1003,
     UNPROSSESABLE_ENTITY = 2001,
     INTERNAL_EXCEPTION = 3001,
     UNAUTHORIZED = 401,

     TODO_NOT_FOUND = 4001
}