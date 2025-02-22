import express from 'express'
import dotenv from 'dotenv'
import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'
import lotRoutes from './routes/lot.routes'
import cors from 'cors'
import path from 'path'
import LotService from './services/lot.service'

const lotService = new LotService()

setInterval(async () => {
    await lotService.activateLots()
}, 60 * 1000)

dotenv.config()

const PORT = process.env.PORT || 3000

const app = express()

function main() {
    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))
    app.use('/api/auth', authRoutes)
    app.use('/api/users', userRoutes)
    app.use('/api/lot', lotRoutes)
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

main()
