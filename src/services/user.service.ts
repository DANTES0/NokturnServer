import { PrismaClient, User } from '@prisma/client'

class UserService {
    private prisma: PrismaClient

    constructor() {
        this.prisma = new PrismaClient()
    }

    // async updateUser(id: string, firstname: string, lastname: string, mail:string, birthday_date: string, vk_link: string, tg_link: string, description: string, special_info: string)

    async updateUser(id: string, userData: Partial<User>) {
        try {
            if (!userData) {
                throw new Error('Не указаны данные для оьбновленя')
            }
            return await this.prisma.user.update({
                where: { id },
                data: userData,
            })
        } catch (error) {
            throw new Error('Не удалось обновить данные пользователя')
        }
    }

    async findUserById(id: string): Promise<User | null> {
        try {
            return await this.prisma.user.findUnique({
                where: { id },
            })
        } catch (error) {
            throw console.log(error)
        }
    }
    async findAllUsers(): Promise<User[] | null> {
        try {
            return await this.prisma.user.findMany()
        } catch (error) {
            throw console.log(error)
        }
    }
    async createUser(data: { firstname: string; mail: string; password: string; birthday_date: string }): Promise<User> {
        try {
            return await this.prisma.user.create({
                data: {
                    firstname: data.firstname,
                    mail: data.mail,
                    password: data.password,
                    birthday_date: data.birthday_date,
                },
            })
        } catch (error) {
            throw console.log(error)
        }
    }
}

export default UserService
