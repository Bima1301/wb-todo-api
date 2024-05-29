import { Router } from "express";
import authRoutes from "./auth";
import todoRoutes from "./todo";

const rootRouter: Router = Router();
rootRouter.get('/', (req, res) => {
     res.status(200).json({
          message: 'Welcome to the Todo API'
     })
})
rootRouter.use('/auth', authRoutes);
rootRouter.use('/todos', todoRoutes);

export default rootRouter;