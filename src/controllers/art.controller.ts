import ArtService from '@/services/art.service'
import { Request, Response } from 'express'

class ArtController {
    private artService: ArtService

    constructor() {
        this.artService = new ArtService()
    }

    async createArt(req: Request, res: Response): Promise<void> {
        try {
            const { userId, name, load_time } = req.body
            const file = req.files as { image?: Express.Multer.File[] }
            const newArt = await this.artService.createArt(userId, name, load_time, file)
            res.status(200).json(newArt)
        } catch (error) {
            res.status(500).json({ message: 'Ошибка сервера', error: (error as Error).message })
        }
    }

    async getArtsById(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.userId
            const arts = await this.artService.getArtsById(userId)
            res.status(200).json(arts)
        } catch (error) {
            res.status(500).json({ message: 'Ошибка сервера', error: (error as Error).message })
        }
    }

    async getArtsAll(req: Request, res: Response): Promise<void> {
        try {
            const arts = await this.artService.getArtAll()
            res.status(200).json(arts)
        } catch (error) {
            res.status(500).json({ message: 'Ошибка сервера', error: (error as Error).message })
        }
    }
}

export default new ArtController()
