import { PrismaClient, User } from '@prisma/client'

class UserService {
    private prisma: PrismaClient

    constructor() {
        this.prisma = new PrismaClient()
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
    async createUser(data: {
        firstname: string
        mail: string
        password: string
        birthday_date: string
    }): Promise<User> {
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
