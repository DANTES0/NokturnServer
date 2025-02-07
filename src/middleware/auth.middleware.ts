import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { NextFunction, Request, Response } from 'express'

dotenv.config()

const secretKey = process.env.JWT_SECRET || 'secret'

interface JwtPayload {
    id: string
    mail: string
}

interface CustomRequest extends Request {
    user?: JwtPayload
}

class AuthMiddleware {
    static verifyToken(req: CustomRequest, res: Response, next: NextFunction) {
        const token = req.header('Authorization')?.split(' ')[1]

        if (!token) {
            res.status(401).json({ message: 'В доступе отказано' })
            return
        }
        try {
            const decoded = jwt.verify(token, secretKey) as JwtPayload
            req.user = decoded
            next()
        } catch (error) {
            res.status(401).json({ message: 'Неверный токен' })
            return
        }
    }
}

export default AuthMiddleware
