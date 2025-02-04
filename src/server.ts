import express from 'express'
import dotenv from 'dotenv'
import userRoutes from './routes/user.routes'

dotenv.config()

const PORT = process.env.PORT || 3000

const app = express()

function main() {
    app.use(express.json())
    app.use('/api/users', userRoutes)
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

main()
