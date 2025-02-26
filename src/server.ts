import express from 'express'
import dotenv from 'dotenv'
import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'
import lotRoutes from './routes/lot.routes'
import cors from 'cors'
import path from 'path'
import LotService from './services/lot.service'
import http from 'http'
import { Server } from 'socket.io'

dotenv.config()

const PORT = process.env.PORT || 3000

const app = express()

const server = http.createServer(app)
const io = new Server(server, {
    cors: { origin: '*' },
})
const lotService = new LotService()

setInterval(async () => {
    await lotService.activateLots()
}, 60 * 1000)

io.on('connection', (socket) => {
    console.log('Пользователь подключился', socket.id)

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

    io.on('disconnect', () => {
        console.log('Пользователь отключился', socket.id)
    })
})
io.disconnectSockets()
function main() {
    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))
    app.use('/api/auth', authRoutes)
    app.use('/api/users', userRoutes)
    app.use('/api/lot', lotRoutes)
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

main()

export { io }
