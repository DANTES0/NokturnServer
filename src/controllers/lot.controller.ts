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
            res.json(lot)
        } catch (error) {
            res.status(500).json({ message: 'Ошибка сервера', error: (error as Error).message })
        }
    }
}
export default new LotController()
