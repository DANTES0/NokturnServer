import chatController from '@/controllers/chat.controller'
import { Router } from 'express'

const router = Router()

router.get('/chats/:userId', chatController.getChats.bind(chatController))
router.get('/messages/:chatId', chatController.getMessages.bind(chatController))
router.post('/createChats', chatController.createChat.bind(chatController))
router.post('/createMessage', chatController.createMessage.bind(chatController))
export default router
