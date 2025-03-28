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
            const searchQuery = req.query.search as string | undefined
            const users = await this.userService.findAllUsers(searchQuery)
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

            const files = req.files as { [fieldname: string]: Express.Multer.File[] }
            const profile_photo = files?.profile_photo ? files.profile_photo[0] : undefined
            const profile_header_photo = files?.profile_header_photo ? files.profile_header_photo[0] : undefined

            if (typeof userData.name_visible === 'string') {
                userData.name_visible = userData.name_visible === 'true'
            }
            const updateUser = await this.userService.updateUser(id, userData, {
                profile_photo,
                profile_header_photo,
            })

            res.status(200).json(updateUser)
        } catch (error) {
            res.status(500).json({ message: 'Ошибка сервера', error: (error as Error).message })
        }
    }
    async getUsersWithAtLeastThreeArts(req: Request, res: Response) {
        try {
            const limit = parseInt(req.query.limit as string) || 10
            const users = await this.userService.findUsersWithAtLeastThreeArts(limit)
            res.json(users)
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при получении пользователей', error })
        }
    }
}

export default new UserController()
