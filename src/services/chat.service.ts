import { Chat, Message, PrismaClient } from '@prisma/client'

class ChatService {
    private prisma: PrismaClient

    constructor() {
        this.prisma = new PrismaClient()
    }

    // async getAllChatsByUserId(userId: string) {
    //     try {
    //         return await this.prisma.chat.findMany({
    //             where: {
    //                 OR: [{ user1Id: userId }, { user2Id: userId }],
    //             },
    //             include: {
    //                 user1: { select: { id: true, firstname: true, lastname: true, profile_photo: true } },
    //                 user2: { select: { id: true, firstname: true, lastname: true, profile_photo: true } },
    //             },
    //         })
    //     } catch (error) {
    //         throw console.log(error)
    //     }
    // }

    async getAllMessageByUserId(chatId: string): Promise<Message[]> {
        try {
            return await this.prisma.message.findMany({
                where: { chatId },
                orderBy: { createdAt: 'asc' },
                include: { sender: { select: { id: true, firstname: true, lastname: true, profile_photo: true } } },
            })
        } catch (error) {
            throw console.log(error)
        }
    }

    async createChat(user1Id: string, user2Id: string): Promise<Chat> {
        try {
            const existingChat = await this.prisma.chat.findFirst({
                where: {
                    OR: [
                        { user1Id, user2Id },
                        { user1Id: user2Id, user2Id: user1Id },
                    ],
                },
            })

            if (existingChat) {
                return existingChat
            }

            return await this.prisma.chat.create({
                data: { user1Id, user2Id },
            })
        } catch (error) {
            throw console.log(error)
        }
    }

    async getUserChats(userId: string): Promise<Chat[]> {
        try {
            return await this.prisma.chat.findMany({
                where: {
                    OR: [{ user1Id: userId }, { user2Id: userId }],
                },
                include: {
                    user1: { select: { id: true, firstname: true, lastname: true, profile_photo: true } },
                    user2: { select: { id: true, firstname: true, lastname: true, profile_photo: true } },
                    messages: {
                        include: { sender: true },
                    },
                },
            })
        } catch (error) {
            throw console.log(error)
        }
    }

    async createMessage(chatId: string, senderId: string, text: string): Promise<Message> {
        try {
            return await this.prisma.message.create({
                data: { chatId, senderId, text },
                include: {
                    sender: {
                        select: {
                            id: true,
                            firstname: true,
                            lastname: true,
                            profile_photo: true, // Теперь возвращаем фото
                        },
                    },
                },
            })
        } catch (error) {
            throw console.log(error)
        }
    }
}

export default ChatService
