import { Art, PrismaClient } from '@prisma/client'

class ArtService {
    private prisma: PrismaClient

    constructor() {
        this.prisma = new PrismaClient()
    }

    async createArt(userId: string, name: string, image: string, file: { image?: Express.Multer.File[] }): Promise<Art> {
        try {
            if (file.image) {
                image = `/uploads/${file.image[0].filename}`
            }

            return await this.prisma.art.create({
                data: {
                    userId: userId,
                    name: name,
                    image: image,
                    load_time: new Date(),
                },
            })
        } catch (error) {
            throw new Error(`Не удалось создать арт: ${error}`)
        }
    }

    async getArtsById(userId: string): Promise<Art[] | null> {
        try {
            return await this.prisma.art.findMany({
                where: { userId },
                include: {
                    user: {
                        select: { id: true, firstname: true, lastname: true, profile_photo: true },
                    },
                },
            })
        } catch (error) {
            throw new Error(`Не удалось получить арты: ${error}`)
        }
    }

    async getArtAll(): Promise<Art[] | null> {
        try {
            return await this.prisma.art.findMany({
                orderBy: { load_time: 'desc' },
                include: {
                    user: {
                        select: { id: true, firstname: true, lastname: true, profile_photo: true },
                    },
                },
            })
        } catch (error) {
            throw new Error(`Не удалось получить арты: ${error}`)
        }
    }
}
export default ArtService
