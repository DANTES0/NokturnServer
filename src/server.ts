import express from 'express'
import dotenv from 'dotenv'
import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'
import cors from 'cors'

dotenv.config()

const PORT = process.env.PORT || 3000

const app = express()

function main() {
    app.use(cors())
    app.use(express.json())
    app.use('/api/auth', authRoutes)
    app.use('/api/users', userRoutes)
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

main()
