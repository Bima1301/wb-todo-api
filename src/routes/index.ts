import { Router } from "express";
import authRoutes from "./auth";
import todoRoutes from "./todo";

const rootRouter: Router = Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/todos', todoRoutes);

export default rootRouter;