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
                    messages: {
                        select: {
                            id: true,
                            text: true,
                            createdAt: true,
                            senderId: true,
                            isRead: true,
                        },
                    },
                    user1: true,
                    user2: true,
                },
            })
        } catch (error) {
            throw console.log(error)
        }
    }

    async createMessage(chatId: string, senderId: string, text: string, imageUrls: string[]): Promise<Message> {
        try {
            return await this.prisma.message.create({
                data: { chatId, senderId, text, imageUrls, isRead: false },
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

    async countUnreadMessages(chatId: string, senderId: string): Promise<number> {
        try {
            const count = await this.prisma.message.count({
                where: { chatId, isRead: false, senderId: { not: senderId } },
            })
            return count
        } catch (error) {
            throw console.log(error)
        }
    }

    async markMessagesAsRead(chatId: string, userId: string) {
        try {
            return await this.prisma.message.updateMany({
                where: { chatId, senderId: { not: userId }, isRead: false },
                data: { isRead: true },
            })
        } catch (error) {
            throw console.log(error)
        }
    }
    async getReceiverId(chatId: string, senderId: string): Promise<string | null> {
        const chat = await this.prisma.chat.findUnique({
            where: { id: chatId },
            select: { user1: true, user2: true },
        })

        if (!chat) return null

        return chat.user1.id === senderId ? chat.user2.id : chat.user1.id
    }

    async countAllUnreadMessages(userId: string) {
        return await this.prisma.message.count({
            where: {
                chat: {
                    OR: [{ user1Id: userId }, { user2Id: userId }],
                },
                senderId: { not: userId }, // Исключаем свои сообщения
                isRead: false,
            },
        })
    }

    async getMessages(chatId: string) {
        return await this.prisma.message.findMany({
            where: { chatId },
            orderBy: { createdAt: 'asc' },
            select: {
                id: true,
                text: true,
                senderId: true,
                chatId: true,
                createdAt: true,
                isRead: true,
            },
        })
    }

    async getMessageById(id: string) {
        return await this.prisma.message.findUnique({
            where: { id },
        })
    }
}

export default ChatService
