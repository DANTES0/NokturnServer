import AuthService from '@/services/auth.service'
import { Request, Response } from 'express'

class AuthController {
    private authService: AuthService

    constructor() {
        this.authService = new AuthService()
    }

    async register(req: Request, res: Response) {
        try {
            const { firstname, mail, password, birthday_date } = req.body
            const token = await this.authService.register(firstname, mail, password, birthday_date)
            res.status(201).json({ token })
        } catch (error) {
            res.status(400).json({ message: 'Ошибка регистрации', error: (error as Error).message })
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { mail, password } = req.body
            const token = await this.authService.login(mail, password)
            res.status(200).json({ token })
        } catch (error) {
            res.status(400).json({ message: 'Ошибка входа', error: (error as Error).message })
        }
    }
}

export default new AuthController()
