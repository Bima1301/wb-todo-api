import { Router } from "express";
import authRoutes from "./auth";
import todoRoutes from "./todo";
import chatRoutes from "./chat";

const rootRouter: Router = Router();
rootRouter.get('/', (req, res) => {
     res.status(200).json({
          message: 'Welcome to the Todo API'
     })
})
rootRouter.use('/auth', authRoutes);
rootRouter.use('/todos', todoRoutes);
rootRouter.use('/chats', chatRoutes);

export default rootRouter;