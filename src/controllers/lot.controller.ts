import LotService from '@/services/lot.service'
import { Request, Response } from 'express'

class LotController {
    private lotService: LotService

    constructor() {
        this.lotService = new LotService()
    }

    async createLot(req: Request, res: Response): Promise<void> {
        try {
            const lotData = {
                ...req.body,
                starting_bet: parseFloat(req.body.starting_bet),
                min_bid_increment: parseFloat(req.body.min_bid_increment),
                begin_time_date: new Date(req.body.begin_time_date),
                end_time_date: new Date(req.body.end_time_date),
            }
            const files = req.files as { image?: Express.Multer.File[]; another_images?: Express.Multer.File[] }
            const newLot = await this.lotService.createLot(lotData, files)
            res.status(201).json(newLot)
        } catch (error) {
            res.status(500).json({ message: 'Ошибка сервера', error: (error as Error).message })
        }
    }

    async updateLot(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id)
            if (isNaN(id)) {
                res.status(400).json({ message: 'Некорректный ID лота' })
                return
            }

            const lotData = {
                ...req.body,
                starting_bet: req.body.starting_bet ? parseFloat(req.body.starting_bet) : undefined,
                min_bid_increment: req.body.min_bid_increment ? parseFloat(req.body.min_bid_increment) : undefined,
                begin_time_date: req.body.begin_time_date ? new Date(req.body.begin_time_date) : undefined,
                end_time_date: req.body.end_time_date ? new Date(req.body.end_time_date) : undefined,
            }

            const files = req.files as { image?: Express.Multer.File[]; another_images?: Express.Multer.File[] }
            const updatedLot = await this.lotService.updateLot(id, lotData, files)

            res.status(200).json(updatedLot)
        } catch (error) {
            res.status(500).json({ message: 'Ошибка сервера', error: (error as Error).message })
        }
    }

    async deleteLot(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id)
            if (isNaN(id)) {
                res.status(400).json({ message: 'Некорректный ID лота' })
                return
            }

            const result = await this.lotService.deleteLot(id)
            res.status(200).json(result)
        } catch (error) {
            res.status(500).json({ message: 'Ошибка сервера', error: (error as Error).message })
        }
    }

    async getLotById(req: Request, res: Response): Promise<void> {
        try {
            const lotId = req.params.id
            const lot = await this.lotService.findLotById(Number(lotId))
            if (!lot) {
                res.status(404).json({ message: 'Лот не найден' })
                return
            }
            res.status(200).json(lot)
        } catch (error) {
            res.status(500).json({ message: 'Ошибка сервера', error: (error as Error).message })
        }
    }
    async getLotsByCategories(req: Request, res: Response): Promise<void> {
        try {
            const { category, userId, lot_status, name, minStartPrice, maxStartPrice, minCurrentPrice, maxCurrentPrice } = req.query
            const lots = await this.lotService.findLotsByCategory({
                category: category as string | undefined,
                userId: userId as string | undefined,
                lot_status: lot_status as string | undefined,
                name: name as string | undefined,
                minStartPrice: minStartPrice as number | undefined,
                maxStartPrice: maxStartPrice as number | undefined,
                minCurrentPrice: minCurrentPrice as number | undefined,
                maxCurrentPrice: maxCurrentPrice as number | undefined,
            })
            res.status(200).json(lots)
        } catch (error) {
            res.status(500).json({ message: 'Ошибка сервера', error: (error as Error).message })
        }
    }

    async placeUpdatedLotBet(req: Request, res: Response): Promise<void> {
        try {
            const { lotId, bet, userId } = req.body

            console.log('Получены данные для ставки:', { lotId, bet, userId })

            if (!userId || !lotId || !bet) {
                console.error('Ошибка: Все поля обязательны')
                res.status(400).json({ message: 'Все поля обязательны' })
                return
            }

            const placeUpdateLot = await this.lotService.palceBet(userId, lotId, Number(bet))

            console.log('Результат ставки:', placeUpdateLot)
            res.status(200).json(placeUpdateLot)
        } catch (error) {
            console.error('Ошибка при размещении ставки:', error)
            res.status(500).json({ message: 'Ошибка при размещении ставки', error: (error as Error).message })
        }
    }

    async getHistoryLot(req: Request, res: Response): Promise<void> {
        try {
            const { lotId } = req.params

            if (!lotId) {
                res.status(400).json({ message: 'Нет айди лота' })
            }

            const getHistoryLot = await this.lotService.getHistoryLotBet(Number(lotId))
            res.status(200).json(getHistoryLot)
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при просмотре истории ставок', error: (error as Error).message })
        }
    }
}
export default new LotController()
