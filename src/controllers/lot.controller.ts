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
            const { category, userId, lot_status } = req.query
            const lots = await this.lotService.findLotsByCategory({
                category: category as string | undefined,
                userId: userId as string | undefined,
                lot_status: lot_status as string | undefined,
            })
            res.status(200).json(lots)
        } catch (error) {
            res.status(500).json({ message: 'Ошибка сервера', error: (error as Error).message })
        }
    }

    async placeUpdatedLotBet(req: Request, res: Response): Promise<void> {
        try {
            const { lotId, bet, userId } = req.body

            if (!userId || !lotId || !bet) {
                res.status(400).json({ message: 'Все поля обязательны' })
            }

            const placeUpdateLot = await this.lotService.palceBet(userId, lotId, Number(bet))

            res.status(200).json(placeUpdateLot)
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при размещении ставки', error: (error as Error).message })
        }
    }
}
export default new LotController()
