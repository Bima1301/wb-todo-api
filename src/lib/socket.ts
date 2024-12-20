import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
    }
});

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on("join_conversation", (conversationId) => {
        socket.join(conversationId);
        console.log(`Client joined room: ${conversationId}`);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
    });
})

export { io, server, app };