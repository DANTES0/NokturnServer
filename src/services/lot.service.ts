import { io } from '@/server'
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
    async findNewPosts() {}
    async findLotById(id: number): Promise<Lot | null> {
        try {
            return await this.prisma.lot.findUnique({
                where: { id },
            })
        } catch (error) {
            throw console.log(error)
        }
    }
    //ЗАПРОС ДЛЯ ФИЛЬТРОВ
    async findLotsByCategory(filters: { category?: string; userId?: string; lot_status?: string }): Promise<Lot[] | null> {
        try {
            return await this.prisma.lot.findMany({
                where: { category: filters.category, userId: filters.userId, lot_status: filters.lot_status },
            })
        } catch (error) {
            throw console.log(error)
        }
    }

    async activateLots(): Promise<void | null> {
        try {
            const now = new Date()

            const updatedLots = await this.prisma.lot.updateMany({
                where: {
                    lot_status: 'inactive',
                    begin_time_date: {
                        lte: now,
                    },
                },
                data: {
                    lot_status: 'active',
                },
            })
            console.log(`Обновлено лотов: ${updatedLots.count}`)
        } catch (error) {
            console.error('Ошибка при обновлении статуса лотов', error)
        }
    }

    //Сервис для ставок
    async palceBet(userId: string, lotId: string, bet: number) {
        const lot = await this.prisma.lot.findUnique({ where: { id: Number(lotId) } })

        if (!lot) {
            throw new Error('Лот не найден')
        }

        if (bet <= lot.current_bet) {
            throw new Error('Ставка должна быть выше текущей')
        }

        await this.prisma.historyLotBet.create({
            data: {
                userId: userId,
                lotId: Number(lotId),
                bet: bet,
                time_date: new Date(),
            },
        })
        const updatedLot = await this.prisma.lot.update({
            where: { id: Number(lotId) },
            data: { current_bet: bet },
        })
        io.emit('newBet', { lotId, bet, userId })

        return updatedLot
    }
}

export default LotService
