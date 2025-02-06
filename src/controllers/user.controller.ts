import UserService from '@/services/user.service'
import { Request, Response } from 'express'

interface JwtPayload {
    id: string
    mail: string
}

interface CustomRequest extends Request {
    user?: JwtPayload
}

class UserController {
    private userService: UserService

    constructor() {
        this.userService = new UserService()
    }
    async getCurrentUser(req: CustomRequest, res: Response): Promise<void> {
        try {
            console.log('Запрос на получение пользователя')
            const userId = req.user?.id
            if (!userId) {
                res.status(401).json({ message: 'Пользователь не авторизован' })
                return
            }
            const user = await this.userService.findUserById(userId)
            if (!user) {
                res.status(404).json({ message: 'Пользователь не найден' })
                return
            }
            res.json(user)
        } catch (error) {
            res.status(500).json({ message: 'Ошибка сервера', error: (error as Error).message })
        }
    }

    async getUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id
            const user = await this.userService.findUserById(userId)
            if (!user) {
                res.status(404).json({ message: 'Пользователь не найден' })
                return
            }
            res.json(user)
        } catch (error) {
            {
                res.status(500).json({ message: 'Ошибка сервера', error: (error as Error).message })
            }
        }
    }
    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.userService.findAllUsers()
            res.json(users)
        } catch (error) {
            res.status(500).json({ message: 'Ошибка сервера', error: (error as Error).message })
        }
    }
    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const { firstname, mail, password, birthday_date } = req.body
            if (!firstname || !mail || !password || !birthday_date) {
                res.status(400).json({ message: 'Имя, почта, пароль и дата рождения обязательны' })
                return
            }
            const user = await this.userService.createUser({
                firstname,
                mail,
                password,
                birthday_date,
            })
            res.status(201).json(user)
        } catch (error) {
            res.status(500).json({ message: 'Ошибка сервера', error: (error as Error).message })
        }
    }

    async UpdateUser(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            const userData = req.body

            const updateUser = await this.userService.updateUser(id, userData)

            res.status(200).json(updateUser)
        } catch (error) {
            res.status(500).json({ message: 'Ошибка сервера', error: (error as Error).message })
        }
    }
}

export default new UserController()
