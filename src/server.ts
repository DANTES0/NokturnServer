import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import http from 'http'
import { Server } from 'socket.io'

import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'
import lotRoutes from './routes/lot.routes'
import commentRoutes from './routes/comment.routes'
import artRoutes from './routes/art.routes'
import chatRoutes from './routes/chat.routes'

import LotService from './services/lot.service'
import ChatService from './services/chat.service'

dotenv.config()

const PORT = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*' } })

const lotService = new LotService()
const chatService = new ChatService()

setInterval(async () => {
    await lotService.activateLots()
    await lotService.completedLots()
}, 60 * 1000)

io.on('connection', (socket) => {
    console.log('Пользователь подключился', socket.id)

    socket.on('joinUserRoom', (userId) => {
        console.log('Получен userId в joinUserRoom:', userId)
        if (!userId) {
            console.warn('Ошибка: userId === null или undefined!')
            return
        }
        socket.join(`user_${userId}`)
        console.log(`Пользователь ${userId} теперь в user_${userId}`)
    })

    socket.on('leaveUserRoom', (userId) => {
        socket.leave(`user_${userId}`)
        console.log(`Пользователь ${userId} покинул user_${userId}`)
    })

    socket.on('placeBet', async (data) => {
        console.log('Ставка получена', data)

        io.emit('newBet', data)
        const updatedHistory = await lotService.getHistoryLotBet(data.lotId)
        console.log('Отправляем обновлённую историю:', updatedHistory)
        io.emit('updateHistory', updatedHistory)
    })

    socket.on('leaveLot', (userId) => {
        console.log(`Пользователь ${userId} ушёл`, socket.id)
        socket.leave(`user_${userId}`)
    })

    socket.on('sendMessage', async ({ chatId, senderId, text }) => {
        console.log(`Новое сообщение в чате ${chatId} от ${senderId}: ${text}`)

        const newMessage = await chatService.createMessage(chatId, senderId, text)
        io.to(`chat_${chatId}`).emit('newMessage', newMessage)

        const receiverId = await chatService.getReceiverId(chatId, senderId)
        io.to(`user_${receiverId}`).emit('newMessageNotification', newMessage)

        console.log('ПЙДАЙАДЙА', receiverId)

        const unreadCount = await chatService.countUnreadMessages(chatId, senderId)
        io.to(`chat_${chatId}`).emit('updateUnreadCount', { chatId, count: unreadCount })
        io.to(`user_${receiverId}`).emit('updateUnreadCount', { chatId, count: unreadCount })
    })

    socket.on('markAsRead', async ({ chatId, userId }) => {
        console.log(`Пользователь ${userId} прочитал сообщения в чате ${chatId}`)
        await chatService.markMessagesAsRead(chatId, userId)
        io.to(`chat_${chatId}`).emit('updateUnreadCount', { chatId, count: 0 })
    })

    socket.on('joinChat', (chatId) => {
        socket.join(`chat_${chatId}`)
        console.log(`Пользователь ${socket.id} присоединился к чату ${chatId}`)
    })

    socket.on('leaveChat', (chatId) => {
        socket.leave(`chat_${chatId}`)
        console.log(`Пользователь ${socket.id} покинул чат ${chatId}`)
    })

    socket.on('disconnect', () => {
        console.log('Пользователь отключился', socket.id)
    })
})

function main() {
    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

    app.use('/api/auth', authRoutes)
    app.use('/api/users', userRoutes)
    app.use('/api/lot', lotRoutes)
    app.use('/api/comment', commentRoutes)
    app.use('/api/art', artRoutes)
    app.use('/api/chat', chatRoutes)

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

main()

export { io }
