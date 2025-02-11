import { PrismaClient, Lot } from '@prisma/client'

class LotService {
    private prisma: PrismaClient

    constructor() {
        this.prisma = new PrismaClient()
    }

    async createLot(
        lotData: Omit<Lot, 'id' | 'updated_at' | 'user' | 'buyer_id' | 'current_bet' | 'reserve_price'>,
        files?: { image?: Express.Multer.File[]; another_images?: Express.Multer.File[] },
    ): Promise<Lot> {
        try {
            if (!lotData) {
                throw new Error('Данные лота не указаны')
            }

            if (files?.image) {
                lotData.image = `/uploads/${files.image[0].filename}`
            }
            if (files?.another_images) {
                lotData.another_images = files.another_images.map((file) => `/uploads/${file.filename}`)
            }
            return await this.prisma.lot.create({
                data: {
                    userId: lotData.userId,
                    image: lotData.image,
                    name: lotData.name,
                    category: lotData.category,
                    size: lotData.size,
                    starting_bet: lotData.starting_bet,
                    current_bet: lotData.starting_bet,
                    min_bid_increment: lotData.min_bid_increment,
                    description: lotData.description,
                    lot_status: lotData.lot_status ?? 'active',
                    begin_time_date: lotData.begin_time_date,
                    end_time_date: lotData.end_time_date,
                    another_images: lotData.another_images,
                },
            })
        } catch (error) {
            console.error('Ошибка при создании лота', error)
            throw new Error(`Не удалось создать лот: ${error}`)
        }
    }

    async findAllPosts() {}
    async findLotById(id: number): Promise<Lot | null> {
        try {
            return await this.prisma.lot.findUnique({
                where: { id },
            })
        } catch (error) {
            throw console.log(error)
        }
    }

    async findLotsByCategory(filters: { category?: string }): Promise<Lot[] | null> {
        try {
            return await this.prisma.lot.findMany({
                where: { category: filters.category },
            })
        } catch (error) {
            throw console.log(error)
        }
    }
}

export default LotService
