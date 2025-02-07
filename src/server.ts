import express from 'express'
import dotenv from 'dotenv'
import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'
import cors from 'cors'
import path from 'path'

dotenv.config()

const PORT = process.env.PORT || 3000

const app = express()

function main() {
    app.use(cors())
    app.use(express.json())
    app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))
    app.use('/api/auth', authRoutes)
    app.use('/api/users', userRoutes)
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

main()
