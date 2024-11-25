import { ErrorHandler } from './../error-handler';
import { Router } from "express";
import { conversations, createUserConversation, getMessagesByConvId, getParticipantByConvId, sendMessage } from '../controllers/chat';

const chatRoutes: Router = Router();

chatRoutes.post("/", ErrorHandler(createUserConversation));
chatRoutes.post("/send", ErrorHandler(sendMessage));
chatRoutes.get("/clients", ErrorHandler(conversations));
chatRoutes.get("/participants/:id", ErrorHandler(getParticipantByConvId));
chatRoutes.get("/messages/:id", ErrorHandler(getMessagesByConvId));

export default chatRoutes;