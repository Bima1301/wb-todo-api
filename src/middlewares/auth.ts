import { NextFunction, Request, Response } from "express";
import { ErrorCodes } from "../exceptions";
import { unauthorizedException } from '../exceptions/unauthorized';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets';
import { prismaClient } from '..';
import { User } from "@prisma/client";

declare module 'express' {
     interface Request {
          user?: User;
     }
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
     const token = req.headers.authorization?.split(' ')[1] as string;
     if (!token) {
          next(new unauthorizedException('Unauthorized', ErrorCodes.UNAUTHORIZED));
     }
     try {
          const payload = jwt.verify(token, JWT_SECRET) as any;
          const user = await prismaClient.user.findFirst({ where: { id: payload.userId } });
          if (!user) {
               next(new unauthorizedException('Unauthorized', ErrorCodes.UNAUTHORIZED));
          } else {
               req.user = user;
               next();
          }
     } catch (error) {
          console.log(error);
          next(new unauthorizedException('Unauthorized', ErrorCodes.UNAUTHORIZED));
     }
}

export default authMiddleware;
