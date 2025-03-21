import { PrismaClient, User } from '@prisma/client'

class UserService {
    private prisma: PrismaClient

    constructor() {
        this.prisma = new PrismaClient()
    }

    // async updateUser(id: string, firstname: string, lastname: string, mail:string, birthday_date: string, vk_link: string, tg_link: string, description: string, special_info: string)

    async updateUser(
        id: string,
        userData: Partial<User>,
        files?: { profile_photo?: Express.Multer.File; profile_header_photo?: Express.Multer.File },
    ) {
        try {
            if (!userData) {
                throw new Error('Не указаны данные для оьбновленя')
            }
            if (files?.profile_header_photo) {
                userData.profile_header_photo = `/uploads/${files.profile_header_photo.filename}`
            }
            if (files?.profile_photo) {
                userData.profile_photo = `/uploads/${files.profile_photo.filename}`
            }
            return await this.prisma.user.update({
                where: { id },
                data: userData,
            })
        } catch (error) {
            console.log('ОШибка при добавлении пользователя:', error)
            throw new Error(`Не удалось обновить данные пользователя: ${error}`)
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
    async findAllUsers(searchQuery?: string): Promise<User[] | null> {
        try {
            const users = await this.prisma.user.findMany({
                where: searchQuery
                    ? {
                          OR: [
                              { firstname: { contains: searchQuery, mode: 'insensitive' } },
                              { lastname: { contains: searchQuery, mode: 'insensitive' } },
                          ],
                      }
                    : undefined,
                include: {
                    arts: { select: { id: true, image: true, name: true } },
                },
            })

            // Сортируем по количеству артов
            return users.sort((a, b) => b.arts.length - a.arts.length)
        } catch (error) {
            console.log(error)
            throw new Error('Ошибка при получении пользователей')
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
    async findUsersWithAtLeastThreeArts(limit: number): Promise<User[]> {
        const users = await this.prisma.user.findMany({
            where: {
                arts: {
                    some: {},
                },
            },
            include: {
                arts: {
                    select: { id: true, image: true, name: true },
                },
            },
            orderBy: {
                id: 'asc',
            },
        })
        return users.filter((user) => user.arts.length >= 3).slice(0, limit)
    }
}

export default UserService
