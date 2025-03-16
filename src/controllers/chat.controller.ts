import ChatService from '@/services/chat.service'
import { Request, Response } from 'express'

class ChatController {
    private chatService: ChatService

    constructor() {
        this.chatService = new ChatService()
    }

    async getChats(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params
            const chats = await this.chatService.getUserChats(userId)

            res.status(200).json(chats)
        } catch (error) {
            res.status(500).json({ message: 'Ошибка сервера', error: (error as Error).message })
        }
    }

    async getMessages(req: Request, res: Response): Promise<void> {
        try {
            const { chatId } = req.params
            const messages = await this.chatService.getAllMessageByUserId(chatId)
            res.status(200).json(messages)
        } catch (error) {
            res.status(500).json({ message: 'Ошибка сервера', error: (error as Error).message })
        }
    }

    async createChat(req: Request, res: Response): Promise<void> {
        try {
            const { user1Id, user2Id } = req.body

            if (!user1Id || !user2Id) {
                res.status(400).json({ message: 'Нет данных об одном пользователе' })
                return
            }
            const createChat = await this.chatService.createChat(user1Id, user2Id)
            res.status(200).json(createChat)
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при создании чата ставки', error: (error as Error).message })
        }
    }
    async createMessage(req: Request, res: Response): Promise<void> {
        try {
            const { chatId, senderId, text } = req.body
            if (!chatId || !senderId || !text) {
                res.status(400).json({ message: 'Нет данных' })
                return
            }
            const createMessage = await this.chatService.createMessage(chatId, senderId, text)
            res.status(200).json(createMessage)
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при создании сообщения', error: (error as Error).message })
        }
    }
}

export default new ChatController()
