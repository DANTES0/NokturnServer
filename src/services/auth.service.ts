import { PrismaClient, User } from '@prisma/client'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
dotenv.config()

class AuthService {
    private prisma: PrismaClient
    private secretKey = process.env.JWT_SECRET || 'secret'

    constructor() {
        this.prisma = new PrismaClient()
    }
    async register(firstname: string, mail: string, password: string, birthday_date: string): Promise<string> {
        const existingUser = await this.prisma.user.findUnique({
            where: { mail },
        })
        if (existingUser) {
            throw new Error('Пользователь уже существует')
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await this.prisma.user.create({
            data: {
                firstname: firstname,
                mail: mail,
                password: hashedPassword,
                birthday_date: birthday_date,
            },
        })

        return this.generateToken(user)
    }

    async login(mail: string, password: string): Promise<string> {
        const user = await this.prisma.user.findUnique({
            where: { mail },
        })
        if (!user) {
            throw new Error('Пользователь не найден')
        }
        const isVaildPassword = await bcrypt.compare(password, user.password)
        if (!isVaildPassword) {
            throw new Error('Неверный пароль')
        }
        return this.generateToken(user)
    }

    private generateToken(user: User): string {
        return jwt.sign(
            {
                id: user.id,
                mail: user.mail,
            },
            this.secretKey,
            { expiresIn: '7d' },
        )
    }
}
export default AuthService
