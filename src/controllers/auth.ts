import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { compareSync, hashSync } from "bcrypt";
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets';
import { apiResponse } from "../helper";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCodes } from "../exceptions";
import { SignupSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/not-found";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
     SignupSchema.parse(req.body)
     const { name, email, password } = req.body;

     let user = await prismaClient.user.findFirst({ where: { email } })

     if (user) {
          throw new BadRequestException('User already exists!', ErrorCodes.USER_ALREADY_EXISTS, null)
     }

     user = await prismaClient.user.create({
          data: {
               name,
               email,
               password: hashSync(password, 10)
          }
     })

     const token = jwt.sign({
          userId: user.id,
     }, JWT_SECRET)

     const response = {
          user,
          token
     }

     return res.status(201).json(apiResponse(201, 'User created', response))

}

export const login = async (req: Request, res: Response) => {
     const { email, password } = req.body;

     let user = await prismaClient.user.findFirst({ where: { email } })

     if (!user) {
          throw new NotFoundException('User not found!', ErrorCodes.USER_NOT_FOUND)
     }

     if (!compareSync(password, user.password)) {
          throw new BadRequestException('Invalid Credential!', ErrorCodes.INCORRECT_PASSWORD, null)
     }

     const token = jwt.sign({
          userId: user.id,
     }, JWT_SECRET)

     const response = {
          user,
          token
     }

     return res.status(200).json(apiResponse(200, 'Login successful', response))
}

export const me = async (req: Request, res: Response) => {
     res.status(200).json(apiResponse(200, 'User found', req.user))
}



