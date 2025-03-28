import { io } from '@/server'
import { PrismaClient, Lot, HistoryLotBet } from '@prisma/client'
import ChatService from './chat.service'

class LotService {
    private prisma: PrismaClient
    private chatService: ChatService

    constructor() {
        this.prisma = new PrismaClient()
        this.chatService = new ChatService()
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

    async updateLot(
        id: number,
        lotData: Partial<Omit<Lot, 'id' | 'updated_at' | 'user' | 'buyer_id' | 'current_bet' | 'reserve_price'>>,
        files?: { image?: Express.Multer.File[]; another_images?: Express.Multer.File[] },
    ): Promise<Lot> {
        try {
            const existingLot = await this.prisma.lot.findUnique({ where: { id } })
            if (!existingLot) {
                throw new Error('Лот не найден')
            }

            if (files?.image) {
                lotData.image = `/uploads/${files.image[0].filename}`
            }
            if (files?.another_images) {
                lotData.another_images = files.another_images.map((file) => `/uploads/${file.filename}`)
            } else {
                lotData.another_images = []
            }

            return await this.prisma.lot.update({
                where: { id },
                data: lotData,
            })
        } catch (error) {
            console.error('Ошибка при обновлении лота', error)
            throw new Error(`Не удалось обновить лот: ${error}`)
        }
    }

    async deleteLot(id: number): Promise<{ message: string }> {
        try {
            const existingLot = await this.prisma.lot.findUnique({ where: { id } })
            if (!existingLot) {
                throw new Error('Лот не найден')
            }

            await this.prisma.lot.delete({ where: { id } })
            return { message: 'Лот успешно удален' }
        } catch (error) {
            console.error('Ошибка при удалении лота', error)
            throw new Error(`Не удалось удалить лот: ${error}`)
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
    async findLotsByCategory(filters: {
        category?: string
        userId?: string
        lot_status?: string
        name?: string
        minStartPrice?: number
        maxStartPrice?: number
        minCurrentPrice?: number
        maxCurrentPrice?: number
    }): Promise<Lot[] | null> {
        try {
            return await this.prisma.lot.findMany({
                where: {
                    category: filters.category,
                    userId: filters.userId,
                    lot_status: filters.lot_status,
                    name: filters.name ? { contains: filters.name, mode: 'insensitive' } : undefined,
                    starting_bet:
                        filters.minStartPrice || filters.maxStartPrice
                            ? {
                                  ...(filters.minStartPrice !== undefined ? { gte: Number(filters.minStartPrice) } : {}),
                                  ...(filters.maxStartPrice !== undefined ? { lte: Number(filters.maxStartPrice) } : {}),
                              }
                            : undefined,
                    current_bet:
                        filters.minCurrentPrice || filters.maxCurrentPrice
                            ? {
                                  ...(filters.minCurrentPrice !== undefined ? { gte: Number(filters.minCurrentPrice) } : {}),
                                  ...(filters.maxCurrentPrice !== undefined ? { lte: Number(filters.maxCurrentPrice) } : {}),
                              }
                            : undefined,
                },
                orderBy: { begin_time_date: 'desc' },
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

    async completedLots(): Promise<void | null> {
        try {
            const now = new Date()

            const expiredLots = await this.prisma.lot.findMany({
                where: {
                    end_time_date: { lte: now },
                    lot_status: 'active',
                },
            })
            if (expiredLots.length === 0) return
            for (const lot of expiredLots) {
                const lastBet = await this.prisma.historyLotBet.findFirst({
                    where: { lotId: lot.id },
                    orderBy: { time_date: 'desc' },
                    select: { userId: true },
                })

                // Обновляем статус лота
                await this.prisma.lot.update({
                    where: { id: lot.id },
                    data: {
                        lot_status: 'completed',
                        buyer_id: lastBet ? lastBet.userId : null,
                    },
                })
                console.log(`Лот ${lot.id} завершён. Покупатель: ${lastBet?.userId || 'нет ставок'}`)

                if (lastBet && lastBet.userId) {
                    const authorId = lot.userId
                    const buyerId = lastBet.userId

                    const chat = await this.chatService.createChat(buyerId, authorId)

                    await this.chatService.createMessage(chat.id, authorId, `Поздравляю с покупкой лота ${lot.id}!`, [])
                    console.log(`Чат создан между автором лота ${authorId} и покупателем ${buyerId}.`)
                }
            }
        } catch (error) {
            console.error('Ошибка при обновлении статуса лотов', error)
        }
    }

    //Сервис для ставок
    async palceBet(userId: string, lotId: string, bet: number) {
        const lot = await this.prisma.lot.findUnique({ where: { id: Number(lotId) } })
        // console.log('Лот', lot)
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
        console.log(updatedLot)
        io.emit('newBet', { lotId, bet, userId })

        return updatedLot
    }

    async getHistoryLotBet(lotId: number): Promise<HistoryLotBet[] | null> {
        try {
            const getLot = await this.prisma.historyLotBet.findMany({
                where: { lotId: lotId },
                orderBy: { time_date: 'desc' },
            })
            return getLot
        } catch (error) {
            throw console.log(error)
        }
    }

    async getPreviousHighestBidder(lotId: number): Promise<{ userId: string; bet: number } | null> {
        try {
            const previousBet = await this.prisma.historyLotBet.findMany({
                where: { lotId },
                orderBy: { time_date: 'desc' },
                take: 2,
            })

            if (previousBet.length < 2) return null

            return {
                userId: previousBet[1].userId,
                bet: previousBet[1].bet,
            }
        } catch (error) {
            console.error('Ошибка при получении предыдущего наибольшего бета:', error)
            throw new Error('Не удалось получить предыдущего наибольшего бета')
        }
    }
}

export default LotService
