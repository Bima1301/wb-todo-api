import { ErrorHandler } from './../error-handler';
import { Router } from "express";
import { login, me, signup } from "../controllers/auth";
import authMiddleware from '../middlewares/auth';

const authRoutes: Router = Router();

authRoutes.post("/signup", ErrorHandler(signup));
authRoutes.post("/login", ErrorHandler(login));
authRoutes.get("/me", [authMiddleware], ErrorHandler(me));

export default authRoutes;