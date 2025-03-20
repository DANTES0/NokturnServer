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
    async deleteArt(artId: number): Promise<Art | null> {
        try {
            return await this.prisma.art.delete({
                where: {
                    id: artId,
                },
            })
        } catch (error) {
            throw new Error(`Не удалось удалить арт: ${error}`)
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

    async getArtAll(searchQuery?: string): Promise<Art[] | null> {
        try {
            return await this.prisma.art.findMany({
                where: searchQuery
                    ? {
                          name: {
                              contains: searchQuery,
                              mode: 'insensitive',
                          },
                      }
                    : undefined,
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
