import { apiResponse } from '../helper/index';
import { Request, Response } from "express";
import { prismaClient } from "..";
import { z } from 'zod';
import { io } from '../lib/socket';
import axios from 'axios';

export const conversations = async (req: Request, res: Response) => {
    const conversations = await prismaClient.conversation.findMany({
        where: {
            participants: {
                some: {
                    role: 'ADMIN',
                },
            },
        },
        include: {
            participants: {
                where: { role: 'USER' },
            },
            messages: {
                take: 1, // Ambil pesan terakhir
                orderBy: { createdAt: "desc" },
            },
        },
    });
    // const formattedConversations = conversations.map((conversation) => ({
    //     id: conversation.id,
    //     title: conversation.title,
    //     participants: conversation.participants.map((participant) => ({
    //         email: participant.email,
    //         role: participant.role,
    //     })),
    //     lastMessage: conversation.messages[0]?.text || null,
    //     updatedAt: conversation.updatedAt,
    // }));


    res.status(200).json(apiResponse(200, 'Todos found', conversations));
};


export const createUserConversation = async (req: Request, res: Response) => {
    try {
        const userConversationSchema = z.object({
            email: z.string().email(),
        });
        userConversationSchema.parse(req.body);
        const { email } = req.body;

        let participant = await prismaClient.participant.findFirst({
            where: { email },
        });

        if (!participant) {
            participant = await prismaClient.participant.create({
                data: {
                    email,
                    role: 'USER',
                },
            });
        }

        const existingConversation = await prismaClient.conversation.findFirst({
            where: {
                participants: {
                    some: {
                        email: email,
                    },
                },
            },
            include: {
                participants: true,
            },
        });

        if (existingConversation) {
            return res.status(200).json(apiResponse(200, 'Conversation already exists', existingConversation));
        } else {
            const adminParticipants = await prismaClient.participant.findMany({
                where: { role: 'ADMIN' },
            });

            if (adminParticipants.length === 0) {
                throw new Error('No admin user found.');
            }

            const newConversation = await prismaClient.conversation.create({
                data: {
                    title: `Conversation with ${email}`,
                    participants: {
                        connect: [
                            { id: adminParticipants[0].id },
                            { id: participant.id },
                        ],
                    },
                },
                include: {
                    participants: true,
                },
            });

            return res.status(201).json(apiResponse(201, 'Conversation created', newConversation));
        }
    } catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json(apiResponse(500, 'Internal server error', error));
    }
};

export const sendMessageToBot = async (req: Request, res: Response) => {
    const sendMessageToBotSchema = z.object({
        message: z.string().min(1, "Message text cannot be empty"),
        instruction: z.string().min(1, "Instruction text cannot be empty"),
    });

    try {
        const { message, instruction } = sendMessageToBotSchema.parse(req.body);

        const response = await axios.post('https://openai-service-production.up.railway.app/openai/chat-completion', { message, instruction });

        res.status(200).json(apiResponse(200, 'Message sent to bot successfully', response.data));
    } catch (error) {
        console.error('Error sending message to bot:', error);
        res.status(500).json(apiResponse(500, 'Internal server error', error));
    }
}

export const sendMessage = async (req: Request, res: Response) => {
    const sendMessageSchema = z.object({
        conversationId: z.string().cuid(),
        text: z.string().min(1, "Message text cannot be empty"),
        participantId: z.string().cuid(), // Ganti senderId ke participantId
        isBot: z.boolean().optional(),
    });

    try {
        const { conversationId, text, participantId, isBot } = sendMessageSchema.parse(req.body);

        const conversation = await prismaClient.conversation.findUnique({
            where: { id: conversationId },
            include: {
                participants: true, // Untuk memastikan peserta
            },
        });

        if (!conversation) {
            return res.status(404).json(apiResponse(404, "Conversation not found", null));
        }

        const isParticipant = conversation.participants.some(
            (participant) => participant.id === participantId
        );

        if (!isParticipant) {
            return res.status(403).json(apiResponse(403, "Sender is not a participant of this conversation", null));
        }

        const newMessage = await prismaClient.message.create({
            data: {
                text,
                participantId,
                conversationId,
            },
        });

        await prismaClient.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() },
        });

        io.to(conversationId).emit("new_message", {
            id: newMessage.id,
            text: newMessage.text,
            participantId: newMessage.participantId,
            conversationId: newMessage.conversationId,
            createdAt: newMessage.createdAt,
            participant: {
                id: participantId,
                email: conversation.participants.find(
                    (participant) => participant.id === participantId
                )?.email,
                role: conversation.participants.find(
                    (participant) => participant.id === participantId
                )?.role,
            },
        });

        if (isBot) {
            const admin = conversation.participants.find(
                (participant) => participant.role === "ADMIN"
            );
            if (!admin) {
                return res.status(404).json(apiResponse(404, "Admin participant not found", null));
            }

            try {
                const botResponse = await axios.post(
                    'https://openai-service-production.up.railway.app/openai/chat-completion',
                    {
                        message: text, instruction: `
                            1. Become a professional doctor.
                            2. Provide a response to the message above.
                            3. The response should be professional and helpful.
                            4. The response should be at least 50 words.
                        ` }
                );

                const botText = botResponse.data?.response || "No response from bot.";

                // Simpan respons bot ke database
                const botMessage = await prismaClient.message.create({
                    data: {
                        text: botText,
                        participantId: admin?.id,
                        conversationId,
                    },
                });

                // Emit respons bot ke socket
                io.to(conversationId).emit("new_message", {
                    id: botMessage.id,
                    text: botMessage.text,
                    participantId: botMessage.participantId,
                    conversationId: botMessage.conversationId,
                    createdAt: botMessage.createdAt,
                    participant: {
                        id: admin.id,
                        email: admin.email,
                        role: admin.role,
                    },
                });

                return res.status(201).json(
                    apiResponse(201, "Message sent successfully", {
                        newMessage,
                        botMessage,
                    })
                );
            } catch (error) {
                console.error("Error fetching bot response:", error);
                return res
                    .status(500)
                    .json(apiResponse(500, "Error communicating with bot", error));
            }
        } else {
            // Jika bukan bot, hanya simpan pesan user
            return res.status(201).json(apiResponse(201, "Message sent successfully", newMessage));
        }
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json(apiResponse(500, "Internal server error", error));
    }
};


export const getParticipantByConvId = async (req: Request, res: Response) => {
    const conversationId = req.params.id;
    const conversation = await prismaClient.conversation.findUnique({
        where: { id: conversationId },
        include: {
            participants: true
        },
    })

    if (!conversation) {
        return res.status(404).json(apiResponse(404, 'Conversation not found', null));
    }

    const participants = conversation.participants.map((participant) => ({
        id: participant.id,
        email: participant.email,
        role: participant.role
    }));

    res.status(200).json(apiResponse(200, 'Messages found', participants));
}

export const getMessagesByConvId = async (req: Request, res: Response) => {
    const conversationId = req.params.id;
    console.log('conversationId', conversationId)
    const messages = await prismaClient.message.findMany({
        where: {
            conversationId: conversationId
        },
        include: { participant: true },
        orderBy: { createdAt: 'asc' }
    })

    res.status(200).json(apiResponse(200, 'Messages found', messages));
}